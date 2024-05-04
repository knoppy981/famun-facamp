import React from 'react'
import { FetcherWithComponents, Form, useNavigation } from '@remix-run/react'

import Button from '~/components/button'
import Dialog from '~/components/dialog'
import { FiUpload, FiX } from 'react-icons/fi/index.js'
import { MdCloudUpload } from 'react-icons/md/index.js'
import { Radio, RadioGroup } from '~/components/radioGroup'
import { documentsType, selectedFilesType } from './route'
import { timeout } from '~/utils'
import { OverlayTriggerState } from 'react-stately'
import { AnimatePresence } from 'framer-motion'
import Modal from '~/components/modalOverlay'
import Spinner from '~/components/spinner'
import { UserType } from '~/models/user.server'

const FileForm = ({ state, user, selectedFiles, actionData, fetcher }:
  { state: OverlayTriggerState, user: UserType, selectedFiles: selectedFilesType, actionData: any, fetcher: FetcherWithComponents<any> }
) => {
  const ref = React.useRef<HTMLInputElement>(null)
  const navigation = useNavigation()
  const [file, setFile, selectedFileName, setSelectedFileName, isImageUploaded, imagePreview, isDragging, onDragOver, onDragLeave, handleDrop, onFileChange] =
    useFileSubmission(fetcher.data, state, ref, user)

  return (
    <AnimatePresence>
      {state.isOpen &&
        <Modal state={state} isDismissable>
          <Dialog>
            {!isImageUploaded ?
              <>
                <div className='documents-form-title'>
                  <div className='text w500'>
                    Upload {file ? "do " + selectedFileName : "de Arquivos"} para {user.name}
                  </div>

                  <Button onPress={state.close}>
                    <FiX className='icon' />
                  </Button>
                </div>

                {!file ?
                  <RadioGroup
                    className='documents-radio-input-box'
                    label="Tipo do documento"
                    aria-label="Tipo do documento"
                    action={undefined}
                    isDisabled={undefined}
                    value={selectedFileName}
                    onChange={setSelectedFileName}
                  >
                    {documentsType.map((item, i) => {
                      if (user.delegate && item.type === "advisor") return
                      if (user.delegationAdvisor && item.type === "delegate") return
                      return (
                        <Radio key={i} value={item.key}>{item.value} {selectedFiles[item.key] ? <i className='text'>Reenviar</i> : null}</Radio>
                      )
                    })}
                  </RadioGroup>
                  :
                  null
                }

                <form
                  method='post'
                  encType="multipart/form-data"
                  className={`documents-form ${isDragging ? "dragging" : ""}`}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={handleDrop}
                >
                  {/* it is important that the file input comes at last */}
                  <input type='text' id="user-id" name="user-id" hidden readOnly value={user.id} />
                  <input type='text' id="file-type" name="file-type" hidden readOnly value={selectedFileName} />
                  <input
                    type="file" id="my-file" name="my-file" hidden ref={ref} onChange={onFileChange}
                    accept={`.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf,image/jpeg,image/png`}
                  />

                  {!file ?
                    <>
                      <MdCloudUpload color='white' size={50} />

                      <p>
                        Arraste um arquivo até aqui ou
                      </p>

                      <Button onPress={() => ref.current?.click()} className='secondary-button-box blue-dark'>
                        Procurar
                      </Button>
                    </>
                    :
                    <>
                      <div className='documents-preview' style={{ backgroundImage: `url(${imagePreview})` }} />

                      {file.name}

                      <div className='documents-preview-buttons-container'>
                        <Button className='secondary-button-box red-dark'
                          onPress={() => {
                            setFile(null)
                            if (ref.current) ref.current.value = ""
                          }}
                        >
                          Cancelar
                        </Button>

                        <Button className='secondary-button-box green-dark' type='submit'>
                          {navigation.state !== "idle" ? <Spinner dim='18px' /> : <FiUpload className="icon" />} Enviar Arquivo
                        </Button>
                      </div>
                    </>
                  }
                </form>
              </>
              :
              <div className='documents-form-uploaded'>
                <div className='documents-form-uploaded-text'>
                  Arquivo recebido!
                </div>
              </div>
            }
          </Dialog>
        </Modal>}
    </AnimatePresence>
  )
}

function useFileSubmission(actionData: any, state: OverlayTriggerState, ref: React.RefObject<HTMLInputElement>, user: UserType): [
  File | null,
  React.Dispatch<any>,
  string,
  React.Dispatch<React.SetStateAction<string>>,
  boolean,
  string | null,
  boolean,
  (event: any) => void,
  (event: any) => void,
  (event: any) => void,
  (event: any) => void,
] {
  const [file, setFile] = React.useState<File | null>(null)
  const [imagePreview, setImagePreview] = React.useState<string | null>(null)
  const [isDragging, setIsDragging] = React.useState<boolean>(false)
  const [selectedFileName, setSelectedFileName] = React.useState<string>(user.delegate ? "Position Paper" : "Liability Waiver")
  const [isImageUploaded, setIsImageUploaded] = React.useState<boolean>(false)

  React.useEffect(() => {
    setSelectedFileName(user.delegate ? "Position Paper" : "Liability Waiver")
  }, [user])

  React.useEffect(() => {
    setFile(null)
    setIsImageUploaded(false)
  }, [state.isOpen])

  React.useEffect(() => {
    if (file?.name && actionData?.fileName && actionData?.fileName === file?.name) {
      setIsImageUploaded(true)
      timeout(1500).then(() => {
        state.close()
      })
    }
  }, [actionData])

  const onDragOver = (event: any) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const onDragLeave = (event: any) => {
    event.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (event: any) => {
    event.preventDefault()
    setIsDragging(false)

    const files = event.dataTransfer.files

    if (files.length) {
      setFile(files[0])
      setImagePreview(files[0] ? URL.createObjectURL(files[0]) : null)
    }
  }

  const onFileChange = (event: any) => {
    if (event.target.files.length) {
      setFile(event.target.files[0])
      setImagePreview(event.target.files[0] ? URL.createObjectURL(event.target.files[0]) : null)
    }
  }

  return [file, setFile, selectedFileName, setSelectedFileName, isImageUploaded, imagePreview, isDragging, onDragOver, onDragLeave, handleDrop, onFileChange]
}

export default FileForm

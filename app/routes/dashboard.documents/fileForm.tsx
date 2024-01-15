import React from 'react'
import { Form } from '@remix-run/react'

import Button from '~/components/button'
import Dialog from '~/components/dialog'
import { FiUpload, FiX } from 'react-icons/fi/index.js'
import { MdCloudUpload } from 'react-icons/md/index.js'
import { useFileSubmission } from './useFileSubmission'
import { Radio, RadioGroup } from '~/components/radioGroup'
import { documentsType, selectedFilesType } from './route'
import { timeout } from '~/utils'

const FileForm = ({ close, user, selectedFiles, actionData }:
  { close: () => void, user: any, selectedFiles: selectedFilesType, actionData: any }
) => {
  const ref = React.useRef<HTMLInputElement>(null)
  const [file, setFile, selectedFileName, setSelectedFileName, isImageUploaded, imagePreview, isDragging, onDragOver, onDragLeave, handleDrop, onFileChange] =
    useFileSubmission(actionData, close)

  return (
    <Dialog>
      {!isImageUploaded ?
        <>
          <div className='documents-form-title'>
            <div className='text w500'>
              Upload {file ? "do " + selectedFileName : "de Arquivos"} para {user.name}
            </div>

            <Button onPress={close}>
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
              defaultValue={selectedFileName}
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

          <Form
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
            <input type="file" id="my-file" name="my-file" accept='image/*' hidden ref={ref} onChange={onFileChange} />

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
                  <Button className='secondary-button-box red-dark' onPress={() => setFile(null)}>
                    Cancelar
                  </Button>

                  <Button className='secondary-button-box green-dark' type='submit'>
                    <FiUpload className="icon" /> Enviar Arquivo
                  </Button>
                </div>
              </>
            }
          </Form>
        </>
        :
        <div className='documents-form-uploaded'>
          <div className='documents-form-uploaded-text'>
            File Uploaded!
          </div>
        </div>
      }
    </Dialog>
  )
}

export default FileForm

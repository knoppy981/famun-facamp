import React from 'react'
import { ActionFunctionArgs, LoaderFunctionArgs, UploadHandler, UploadHandlerPart, json, redirect, unstable_parseMultipartFormData } from '@remix-run/node';
import { useActionData, useLoaderData, useRouteError } from '@remix-run/react';

import Link from '~/components/link';
import { getDelegationFilesDescription, uploadFile } from '~/models/file.server';
import { getDelegationId } from '~/session.server';
import { Item, Select } from '~/components/select';
import { UserType } from '~/models/user.server';

import ModalTrigger from '~/components/modalOverlay/trigger';
import { FiFilePlus } from 'react-icons/fi/index.js'
import FileForm from './fileForm';
import { useUser, useUserType } from '~/utils';
import { useOverlayTriggerState } from 'react-stately';
import Button from '~/components/button';

export type filesType = "Position Paper" | "Liability Waiver" | "Payment Voucher"
export type selectedFilesType = {
  "Position Paper": string | boolean,
  "Liability Waiver": string | boolean,
  "Payment Voucher": string | boolean
}
export const documentsType = [
  { key: "Position Paper" as filesType, value: "Position Paper", type: "delegate" },
  { key: "Liability Waiver" as filesType, value: "Termo de Responsabilidade (Liability Waiver)", type: "both" },
  { key: "Payment Voucher" as filesType, value: "Comprovante de pagamento", type: "both" },
]

export const action = async ({ request }: ActionFunctionArgs) => {
  let userId: string, fileType: string

  let uploadHandler = async ({
    name,
    data,
    filename,
    contentType,
  }: UploadHandlerPart) => {
    console.log('name ', name)
    console.log('in uploadHandler', contentType)

    if (name === "my-file") {
      console.log(name, filename)
    } else if (name === "user-id" || name === "file-type") {
      const chunks = []
      for await (const chunk of data) chunks.push(chunk)
      let decoder = new TextDecoder()
      let string = decoder.decode(chunks[0])
      if (name === "user-id") userId = string
      if (name === "file-type") fileType = string
      return string
    } else {
      return
    }

    console.log("userId: " + userId)
    console.log("fileType: " + fileType)

    // Get the file as a buffer
    const chunks = []
    for await (const chunk of data) chunks.push(chunk)
    const buffer = Buffer.concat(chunks)

    console.log(buffer.length)

    try {
      await uploadFile({ userId, stream: buffer, filename, name: fileType, size: buffer.length })
    } catch (error) {
      console.log(error)
    }

    console.log('returning', filename)
    return filename
  };

  // get file info back after image upload
  const form = await unstable_parseMultipartFormData(request, uploadHandler);

  //convert it to an object to padd back as actionData
  const fileInfo = { fileName: form.get('my-file'), userId: form.get("user-id"), fileType: form.get("file-type") };

  // this is response from upload handler
  console.log('the form', fileInfo);

  return fileInfo || null;
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const delegationId = await getDelegationId(request)

  if (!delegationId) throw json({ message: "Você precisa estar em uma delegação para acessar os documentos", name: "Erro no Usuário" }, { status: 404 })

  const delegation = await getDelegationFilesDescription(delegationId)

  return json({ delegation })
}

const Documents = () => {
  const user = useUser()
  const actionData = useActionData<typeof action>();
  const { delegation } = useLoaderData<typeof loader>()
  const [selectedUserId, setSelectedUserId] = React.useState<UserType["id"]>(actionData?.userId ? actionData.userId as string : user.id);
  const selectedUser = delegation?.participants.find(el => el.id === selectedUserId)
  const selectedFiles = handleSelectedFiles(delegation, selectedUserId)
  const userType = useUserType()
  const allowOtherUsersChanges = userType === "advisor" || user.leader
  const state = useOverlayTriggerState({})

  return (
    <div className='section-wrapper padding'>
      <h2 className='section-title'>
        Documentos
      </h2>

      <div className='documents-container'>
        {allowOtherUsersChanges ?
          <Select
            className="documents-select-wrapper"
            aria-label="Selecione um participante"
            isRequired
            items={delegation?.participants?.map(participant => { return { id: participant.id, name: participant.name } })}
            onSelectionChange={value => { if (value !== null) setSelectedUserId(value as string) }}
            selectedKey={selectedUserId}
          >
            {(item) => <Item>{item.name}</Item>}
          </Select>
          :
          null
        }

        <i className='text'>
          Observações:
          <br />
          Se você fez o upload do arquivo e ele não está aparecendo, espere um pouco e recarregue a página
        </i>

        {documentsType.map((item, index) => {
          if (selectedUser?.delegate && item.type === "advisor") return
          if (selectedUser?.delegationAdvisor && item.type === "delegate") return
          const file = selectedFiles[item.key]
          return (
            <div className='documents-file-wrapper' key={index}>
              <p className='text w500'>
                {item.value}
              </p>

              <div className='documents-file-container'>
                {file ?
                  <>
                    <div className='text overflow'>{selectedFiles[item.key]}</div>
                    <div className='secondary-button-box green-light'><div>Recebido</div></div>
                  </>
                  :
                  <>
                    <div className='documents-italic-text'>Documento não recebido</div>
                  </>
                }
              </div>
            </div>
          )
        })}

        <Button className="secondary-button-box blue-light" onPress={state.toggle}>
          <FiFilePlus className='icon' /> Enviar Arquivos
        </Button>

        <FileForm
          state={state}
          user={selectedUser}
          selectedFiles={selectedFiles}
          actionData={actionData}
        />
      </div>
    </div>
  );
}

function handleSelectedFiles(delegation: any, selectedUserId: string) {
  const [selectedFiles, setSelectedFiles] = React.useState<selectedFilesType>({ "Position Paper": false, "Liability Waiver": false, "Payment Voucher": false })
  React.useEffect(() => {
    setSelectedFiles(() => {
      const aux: any = { "Position Paper": false, "Liability Waiver": false, "Payment Voucher": false }
      const files = delegation.participants?.find((el: any) => el.id === selectedUserId)?.files
      files?.forEach((item: any) => {
        aux[item.name] = item.fileName
      });
      return aux
    })
  }, [selectedUserId])

  return selectedFiles
}

export function ErrorBoundary() {
  const error = useRouteError() as any
  console.log(error)

  if (error?.data?.name) {
    return (
      <div className='error-small-container'>
        {/* <h2 className='error-subtitle'>
          Erro :(
        </h2> */}

        <div className='error-message'>
          {error?.data?.message}
        </div>

        <div className='error-link-container'>
          <Link to='/join/delegation'>Entrar em uma delegação</Link>
        </div>
      </div>
    );
  }
  return (
    <div className='error-small-container'>
      <h2 className='error-subtitle'>
        Erro desconhecido
      </h2>

      <div className='error-message'>
        Oops, algo deu errado :(
      </div>

      <div className='error-link-container'>
        <Link to='/'>Voltar para página inicial</Link>
      </div>
    </div>
  );
}


export default Documents

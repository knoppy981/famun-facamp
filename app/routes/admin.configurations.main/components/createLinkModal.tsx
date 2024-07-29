import React from 'react'
import { FetcherWithComponents, Form, useActionData, useFetcher, useNavigation } from '@remix-run/react'
import Button from '~/components/button'
import Dialog from '~/components/dialog'
import { FiX } from "react-icons/fi/index.js";
import TextField from '~/components/textfield'
import Spinner from '~/components/spinner'
import { FiCheck, FiCopy, FiEdit, FiInfo, FiLink, FiTrash2 } from 'react-icons/fi/index.js';

const CreateLinkModal = ({ close }: { close: () => void }) => {
  const fetcher = useFetcher<any>()
  React.useEffect(() => {
    if (fetcher.data?.newAuthentication) close()
  }, [fetcher.data])

  return (
    <Dialog>
      <div className="admin-dialog-title">
        <h2>
          Gerar Link
        </h2>

        <Button onPress={close}>
          <FiX className='icon' />
        </Button>
      </div>

      <fetcher.Form className='committee-add-form' method='POST'>
        <TextField
          className='primary-input-box'
          name="link-name"
          label="Nome do link"
          theme='dark'
        />

        <div className='committee-selected-delegates'>
          O nome para o link é apenas para ajudar a identificar qual link é qual, e pode ser deixado em branco
        </div>

        <Button
          type='submit'
          name='action'
          value="create"
          className='committee-add-form-button'
          isDisabled={fetcher.state !== "idle"}
        >
          {fetcher.state !== 'idle' ? <Spinner dim="18px" color='#fff' /> : <FiLink className='icon' />}
          Gerar novo link
        </Button>
      </fetcher.Form>
    </Dialog>
  )
}

export default CreateLinkModal

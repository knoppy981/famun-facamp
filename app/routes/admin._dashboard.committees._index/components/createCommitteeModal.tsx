import React from 'react'
import { FetcherWithComponents, useFetcher } from '@remix-run/react';
import { ParticipationMethod } from '@prisma/client';

import Button from '~/components/button';
import { Select, Item } from '~/components/select';
import Dialog from '~/components/dialog'
import TextField from '~/components/textfield';
import { FiX } from "react-icons/fi/index.js";
import Spinner from '~/components/spinner';

const CreateCommitteeModal = ({ close, participationMethod, councilOptions }: { close: () => void, participationMethod: ParticipationMethod, councilOptions: string[] | undefined }) => {
  const fetcher = useFetcher<any>()
  useCreateCommittee(fetcher, close)

  return (
    <Dialog>
      <div className="admin-dialog-title">
        <h2>
          Adicionar Conferência para {participationMethod}s
        </h2>

        <Button onPress={close}>
          <FiX className='icon' />
        </Button>
      </div>

      <fetcher.Form className='committee-add-form' method='POST'>
        <TextField
          className='primary-input-box'
          label='Nome'
          theme='dark'
          name='name'
          autoFocus
          isInvalid={fetcher.data?.errors?.name ? true : false}
          errorMessage={fetcher.data?.errors?.name}
          action={fetcher.data}
        />

        <Select
          className='primary-input-box'
          label='Conselho/Comitê'
          theme='dark'
          defaultSelectedKey='Assembleia_Geral_da_ONU'
          items={councilOptions?.map(item => ({ id: item }))}
          isInvalid={fetcher.data?.errors?.council ? true : false}
          errorMessage={fetcher.data?.errors?.council}
          action={fetcher.data}
          name='council'
        >
          {(item: { id: string }) => <Item>{item.id.replace(/_/g, " ")}</Item>}
        </Select>

        <input type='hidden' name="type" value={participationMethod} />

        <Button type='submit' className='committee-add-form-button' isDisabled={fetcher.state !== "idle"}>
          {fetcher.state !== 'idle' && <Spinner dim="18px" color='#fff' />}
          Criar
        </Button>
      </fetcher.Form>
    </Dialog>
  )
}

function useCreateCommittee(fetcher: FetcherWithComponents<any>, close: () => void) {
  React.useEffect(() => {
    if (fetcher.data?.committee) close()
  }, [fetcher.data])
}

export default CreateCommitteeModal

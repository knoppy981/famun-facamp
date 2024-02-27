import React from 'react'
import { FetcherWithComponents, useFetcher } from '@remix-run/react';
import { AnimatePresence } from 'framer-motion'
import { ParticipationMethod } from '@prisma/client';
import { OverlayTriggerState } from 'react-stately'

import Modal from '~/components/modalOverlay'
import Button from '~/components/button';
import { Select, Item } from '~/components/select';
import Dialog from '~/components/dialog'
import TextField from '~/components/textfield';
import { FiX } from "react-icons/fi/index.js";

const CreateComittee = ({ state, participationMethod }: { state: OverlayTriggerState, participationMethod: ParticipationMethod }) => {
  const fetcher = useFetcher<any>()
  useCreateComittee(fetcher, state)

  return (
    <AnimatePresence>
      {state.isOpen &&
        <Modal state={state} isDismissable>
          <Dialog>
            <div className="admin-dialog-title">
              <h2>
                Adicionar Conferência para {participationMethod}s
              </h2>

              <Button onPress={state.close}>
                <FiX className='icon' />
              </Button>
            </div>

            <fetcher.Form className='comittee-add-form' method='POST'>
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
                items={[
                  { id: 'Assembleia_Geral_da_ONU' },
                  { id: 'Rio_92' },
                  { id: 'Conselho_de_Juventude_da_ONU' },
                  { id: 'Conselho_de_Seguranca_da_ONU' },
                ]}
                isInvalid={fetcher.data?.errors?.council ? true : false}
                errorMessage={fetcher.data?.errors?.council}
                action={fetcher.data}
                name='council'
              >
                {(item: { id: string }) => <Item>{item.id.replace(/_/g, " ")}</Item>}
              </Select>

              <input type='hidden' name="type" value={participationMethod} />

              <Button type='submit' className='comittee-add-form-button' isDisabled={fetcher.state !== "idle"}>
                Criar
              </Button>
            </fetcher.Form>
          </Dialog>
        </Modal>
      }
    </AnimatePresence >
  )
}

function useCreateComittee(fetcher: FetcherWithComponents<any>, state: OverlayTriggerState) {
  React.useEffect(() => {
    if (fetcher.data?.comittee) state.close()
  }, [fetcher.data])
}

export default CreateComittee

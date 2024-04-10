import { ParticipationMethod } from '@prisma/client'
import { FetcherWithComponents, useFetcher } from '@remix-run/react'
import { AnimatePresence } from 'framer-motion'
import React from 'react'
import { OverlayTriggerState } from 'react-stately'
import Button from '~/components/button'
import Dialog from '~/components/dialog'
import Modal from '~/components/modalOverlay'
import { FiX } from "react-icons/fi/index.js";
import { NumberField } from '~/components/textfield/numberField'
import TextField from '~/components/textfield'
import Spinner from '~/components/spinner'

const ChangeMaxParticipants = ({ state, maxParticipants, delegationId }: { state: OverlayTriggerState, maxParticipants: number, delegationId: string }) => {
  const fetcher = useFetcher<any>()
  const [handleChangeMaxParticipants, value, setValue] = useChangeMaxParticipants(state, fetcher, maxParticipants, delegationId)

  return (
    <AnimatePresence>
      {state.isOpen &&
        <Modal state={state} isDismissable>
          <Dialog>
            <div className="admin-dialog-title">
              <h2>
                Alterar o máximo de delegados
              </h2>

              <Button onPress={state.close}>
                <FiX className='icon' />
              </Button>
            </div>

            <fetcher.Form className='committee-add-form' method='POST'>
              <NumberField
                className='primary-input-box'
                name="maxParticipants"
                label="Número de Delegados"
                theme='dark'
                minValue={1}
                value={value}
                onChange={e => setValue(e as number)}
                maxValue={20}
              />

              <Button
                type='button'
                className='committee-add-form-button'
                isDisabled={fetcher.state !== "idle" || value === maxParticipants}
                onPress={handleChangeMaxParticipants}
              >
                {fetcher.state !== 'idle' && <Spinner dim="18px" color='#fff' />}
                Alterar
              </Button>
            </fetcher.Form>
          </Dialog>
        </Modal>
      }
    </AnimatePresence >
  )
}

function useChangeMaxParticipants(state: OverlayTriggerState, fetcher: FetcherWithComponents<any>, maxParticipants: number, delegationId: string): [
  () => void, number, React.Dispatch<React.SetStateAction<number>>
] {
  const [value, setValue] = React.useState(maxParticipants)

  const handleChangeMaxParticipants = () => {
    fetcher.submit(
      { delegationId, maxParticipants: value },
      { method: "post", action: "/api/admin/delegation/maxParticipants", preventScrollReset: true, navigate: false, }
    )
  }

  React.useEffect(() => {
    if (fetcher.data?.delegation) state.close()
  }, [fetcher.data])

  return [handleChangeMaxParticipants, value, setValue]
}

export default ChangeMaxParticipants

import React from 'react'
import { FetcherWithComponents, useFetcher } from '@remix-run/react'
import Button from '~/components/button'
import { OverlayTriggerState } from 'react-stately'
import Spinner from '~/components/spinner'
import ModalTrigger from '~/components/modalOverlay/trigger'
import Dialog from '~/components/dialog'
import { FiUserMinus } from 'react-icons/fi/index.js'
import { UserType } from '~/models/user.server'
import { AnimatePresence } from 'framer-motion'
import Modal from '~/components/modalOverlay'


const DeleteParticipant = ({ state, parentState, participant }: { state: OverlayTriggerState, parentState: OverlayTriggerState, participant: UserType }) => {
  const fetcher = useFetcher<any>()
  const [handleRemoveParticipant] = useDeleteParticipant(state, parentState, fetcher)

  return (
    <AnimatePresence>
      {state.isOpen &&
        <Modal state={state} isDismissable>
          <Dialog maxWidth>
            <div className="dialog-title">
              Tem certeza que deseja excluír a conta do(a) {participant.name}?
            </div>

            <div className="dialog-subitem">
              Obs: Todos os dados do participante serão perdidos, se já foi realizado um pagamento
              para a inscrição deste usuário não haverá nenhum tipo de reembolso
            </div>

            <Button
              className="secondary-button-box blue-dark"
              onPress={() => {
                close()
              }}
            >
              Cancelar
            </Button>

            <Button
              className="secondary-button-box red-dark"
              isDisabled={fetcher.state !== "idle"}
              onPress={() => {
                handleRemoveParticipant(participant.id)
              }}
            >
              {fetcher.state !== "idle" ? "Removendo..." : "Remover"}
            </Button>
          </Dialog>
        </Modal>
      }
    </AnimatePresence>
  )
}

function useDeleteParticipant(state: OverlayTriggerState, parentState: OverlayTriggerState, fetcher: FetcherWithComponents<any>) {
  const handleRemoveParticipant = (participantId: string) => {
    fetcher.submit(
      { participantId },
      { method: "post", action: "/api/participant/delete", navigate: true }
    )
  }

  React.useEffect(() => {
    if (fetcher?.data?.user) {
      state.close()
      parentState.close()
    }
  }, [fetcher])

  return [handleRemoveParticipant]
}

export default DeleteParticipant
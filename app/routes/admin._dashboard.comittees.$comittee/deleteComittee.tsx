import { ParticipationMethod } from '@prisma/client'
import { FetcherWithComponents, useFetcher } from '@remix-run/react'
import { AnimatePresence } from 'framer-motion'
import React from 'react'
import { OverlayTriggerState } from 'react-stately'
import Button from '~/components/button'
import Dialog from '~/components/dialog'
import Modal from '~/components/modalOverlay'
import { ComitteeType } from './route'

const DeleteComittee = ({ state, comittee }: { state: OverlayTriggerState, comittee: ComitteeType }) => {
  const fetcher = useFetcher<any>()
  const [handleDeleteComittee] = useDeleteComittee(state, fetcher, comittee)

  return (
    <AnimatePresence>
      {state.isOpen &&
        <Modal isDismissable state={state}>
          <Dialog maxWidth>
            <div className="dialog-title">
              Tem certeza que deseja excluír o comitê {comittee.name}?
            </div>

            <Button
              className="secondary-button-box blue-dark"
              onPress={state.close}
            >
              Cancelar
            </Button>

            <Button
              className="secondary-button-box red-dark"
              onPress={handleDeleteComittee}
              isDisabled={fetcher.state !== "idle"}
            >
              {fetcher.state !== "idle" ? "Excluindo" : "Excluír"}
            </Button>
          </Dialog>
        </Modal>}
    </AnimatePresence>
  )
}

function useDeleteComittee(state: OverlayTriggerState, fetcher: FetcherWithComponents<any>, comittee: any): [
  () => void
] {
  const handleDeleteComittee = () => {
    fetcher.submit(
      { id: comittee.id },
      { method: "post", action: "/api/deleteComittee" }
    )
  }

  return [handleDeleteComittee]
}

export default DeleteComittee

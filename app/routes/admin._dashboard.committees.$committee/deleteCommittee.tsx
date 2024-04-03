import { ParticipationMethod } from '@prisma/client'
import { FetcherWithComponents, useFetcher } from '@remix-run/react'
import { AnimatePresence } from 'framer-motion'
import React from 'react'
import { OverlayTriggerState } from 'react-stately'
import Button from '~/components/button'
import Dialog from '~/components/dialog'
import Modal from '~/components/modalOverlay'
import { CommitteeType } from './route'

const DeleteCommittee = ({ state, committee }: { state: OverlayTriggerState, committee: CommitteeType }) => {
  const fetcher = useFetcher<any>()
  const [handleDeleteCommittee] = useDeleteCommittee(state, fetcher, committee)

  return (
    <AnimatePresence>
      {state.isOpen &&
        <Modal isDismissable state={state}>
          <Dialog maxWidth>
            <div className="dialog-title">
              Tem certeza que deseja excluír o comitê {committee.name}?
            </div>

            <Button
              className="secondary-button-box blue-dark"
              onPress={state.close}
            >
              Cancelar
            </Button>

            <Button
              className="secondary-button-box red-dark"
              onPress={handleDeleteCommittee}
              isDisabled={fetcher.state !== "idle"}
            >
              {fetcher.state !== "idle" ? "Excluindo" : "Excluír"}
            </Button>
          </Dialog>
        </Modal>}
    </AnimatePresence>
  )
}

function useDeleteCommittee(state: OverlayTriggerState, fetcher: FetcherWithComponents<any>, committee: any): [
  () => void
] {
  const handleDeleteCommittee = () => {
    fetcher.submit(
      { id: committee.id },
      { method: "post", action: "/api/admin/committee/delete" }
    )
  }

  return [handleDeleteCommittee]
}

export default DeleteCommittee

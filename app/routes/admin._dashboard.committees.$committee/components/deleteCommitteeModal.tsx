import { ParticipationMethod } from '@prisma/client'
import { FetcherWithComponents, useFetcher } from '@remix-run/react'
import { AnimatePresence } from 'framer-motion'
import React from 'react'
import { OverlayTriggerState } from 'react-stately'
import Button from '~/components/button'
import Dialog from '~/components/dialog'
import Modal from '~/components/modalOverlay'
import { CommitteeType } from '../route'

const DeleteCommitteeModal = ({ close, committee }: { close: () => void, committee: CommitteeType }) => {
  const fetcher = useFetcher<any>()
  const [handleDeleteCommittee] = useDeleteCommittee(close, fetcher, committee)

  return (
    <Dialog maxWidth>
      <div className="dialog-title">
        Tem certeza que deseja excluír o comitê {committee.name}?
      </div>

      <Button
        className="secondary-button-box blue-dark"
        onPress={close}
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
  )
}

function useDeleteCommittee(close: () => void, fetcher: FetcherWithComponents<any>, committee: any): [
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

export default DeleteCommitteeModal

import React from 'react'
import { useSubmit } from '@remix-run/react'
import { FiTrash2 } from 'react-icons/fi/index.js'
import Button from '~/components/button'
import Dialog from '~/components/dialog'

const DeleteDelegationModal = ({ close, delegationId }: { close: () => void, delegationId: string }) => {
  const [handleRemoveParticipant] = useDeleteDelegation()

  return (
    <Dialog maxWidth>
      <div className="dialog-title">
        Tem certeza que deseja excluír essa delegação?
      </div>

      <div className="dialog-subitem">
        Obs: Todos os participantes presentes nesta delegação ficaram sem delegação, os dados da delegação como o endereço e número para contato serão perdidos. <br />
        É importante ressaltar que delegados presentes nessa delegação que já foram designados para algum comitê/conselho continuarão designados.
      </div>

      <Button
        className="secondary-button-box red-dark"
        onPress={() => {
          close()
        }}
      >
        Cancelar
      </Button>

      <Button
        className="secondary-button-box blue-dark"
        onPress={() => {
          close()
          handleRemoveParticipant(delegationId)
        }}
      >
        <FiTrash2 className='icon' /> Excluír Delegação
      </Button>
    </Dialog>
  )
}

function useDeleteDelegation() {
  const submit = useSubmit()

  const handleRemoveParticipant = (delegationId: string) => {
    submit(
      { delegationId },
      { method: "post", action: "/api/admin/delegation/delete", navigate: false }
    )
  }

  return [handleRemoveParticipant]
}

export default DeleteDelegationModal

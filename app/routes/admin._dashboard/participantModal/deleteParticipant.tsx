import React from 'react'
import { FetcherWithComponents, useFetcher } from '@remix-run/react'
import Button from '~/components/button'
import { OverlayTriggerState } from 'react-stately'
import Spinner from '~/components/spinner'


const DeleteParticipant = ({ state, participantId }: { state: OverlayTriggerState, participantId: string }) => {
  const fetcher = useFetcher<any>()
  const [handleRemoveParticipant] = useDeleteParticipant(state, fetcher)

  return (
    <div className='admin-delegation-notification-container' style={{ maxWidth: "500px" }}>
      <div className="admin-delegation-documents-buttons-container">
        <Button
          onPress={() => handleRemoveParticipant(participantId)}
          className="secondary-button-box red-dark"
        >
          {fetcher.state !== "idle" ? <Spinner dim='18px' /> : null} Remover Participante
        </Button>
      </div>
    </div>
  )
}

function useDeleteParticipant(state: OverlayTriggerState, fetcher: FetcherWithComponents<any>) {
  const handleRemoveParticipant = (participantId: string) => {
    fetcher.submit(
      { participantId },
      { method: "post", action: "/api/participant/delete", navigate: true }
    )
  }

  React.useEffect(() => {
    if (fetcher?.data?.user) {
      state.close()
    }
  }, [fetcher])

  return [handleRemoveParticipant]
}

export default DeleteParticipant
import React from "react"
import { OverlayTriggerState, useOverlayTriggerState } from "react-stately"

export function useParticipantModal(): [OverlayTriggerState, any, React.Dispatch<any>] {
  const [selectedParticipantId, setSelectedParticipantId] = React.useState<string>()
  const overlayState = useOverlayTriggerState({})

  const handleParticipantChange = (participantId: string) => {
    setSelectedParticipantId(participantId)
  }

  return [overlayState, selectedParticipantId, handleParticipantChange]
}
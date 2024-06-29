import React from "react"
import { useFetcher } from "@remix-run/react"

export default function usePresenceControl(): ["idle" | "loading" | "submitting", (participantId: string, checkin: any) => void, string] {
  const fetcher = useFetcher<any>()
  const [userIdBeingCheckIn, setUserIdBeingCheckIn] = React.useState("")

  const handleCheckin = (participantId: string, checkin: any) => {
    setUserIdBeingCheckIn(participantId)
    fetcher.submit(
      { participantId, checkin },
      { method: "post", preventScrollReset: true }
    )
  }

  return [fetcher.state, handleCheckin, userIdBeingCheckIn]
}

import React from "react"
import { ParticipationMethod } from "@prisma/client"
import { useFetcher } from "@remix-run/react"
import { exportAoo } from "~/sheets"

export default function useDelegationsSheet(participationMethod: ParticipationMethod) {
  const fetcher = useFetcher<any>()
  let isDownloadingDelegationSheet = fetcher.state !== "idle"

  const downloadDelegationsSheet = () => {
    fetcher.load(`/api/aoo/delegations?pm=${participationMethod}`)
  }

  React.useEffect(() => {
    if (fetcher.data?.aoo) {
      exportAoo(fetcher.data?.aoo, "Delegações")
    }
  }, [fetcher.data])

  return {downloadDelegationsSheet, isDownloadingDelegationSheet}
}
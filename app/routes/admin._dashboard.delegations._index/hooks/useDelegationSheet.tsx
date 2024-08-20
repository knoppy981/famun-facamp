import React from "react"
import { ParticipationMethod } from "@prisma/client"
import { useFetcher } from "@remix-run/react"
import { exportAoo } from "~/sheets"

export default function useDelegationsSheet(participationMethod: ParticipationMethod): [() => void, "idle" | "loading" | "submitting"] {
  const fetcher = useFetcher<any>()

  const handleDownload = () => {
    fetcher.load(`/api/aoo/delegations?pm=${participationMethod}`)
  }

  React.useEffect(() => {
    if (fetcher.data?.aoo) {
      exportAoo(fetcher.data?.aoo, "Delegações")
    }
  }, [fetcher.data])

  return [handleDownload, fetcher.state]
}
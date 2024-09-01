import React from "react"
import { ParticipationMethod } from "@prisma/client"
import { useFetcher } from "@remix-run/react"
import { exportAoa } from "~/sheets"
import useDidMountEffect from "~/hooks/useDidMountEffect"

export default function useCredentialsSheet(participationMethod: ParticipationMethod) {
  const fetcher = useFetcher<any>()
  let isDownloadingCredentialsSheet = fetcher.state !== "idle"

  const downloadCredentialsSheet = () => {
    fetcher.submit({ pm: participationMethod }, { action: "/api/aoa/credentials", method: "POST" })
  }

  useDidMountEffect(() => {
    if (fetcher.data?.aoa) {
      exportAoa(fetcher.data?.aoa, `Credenciamento_Diário_${participationMethod === "Escola" ? "Ensino Médio" : participationMethod}`)
    }
  }, [fetcher.data?.aoa])

  return { downloadCredentialsSheet, isDownloadingCredentialsSheet }
}
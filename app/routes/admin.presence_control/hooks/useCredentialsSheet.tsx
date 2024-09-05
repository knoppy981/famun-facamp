import React from "react"
import { ParticipationMethod } from "@prisma/client"
import { useFetcher } from "@remix-run/react"
import { exportAoa } from "~/sheets"
import useDidMountEffect from "~/hooks/useDidMountEffect"

export default function useCredentialsSheet() {
  const fetcher = useFetcher<any>()
  let isDownloadingCredentialsSheet = fetcher.state !== "idle"
  const [pm, setPm] = React.useState<ParticipationMethod>("Escola")

  const downloadCredentialsSheet = (participationMethod: ParticipationMethod) => {
    fetcher.submit({ pm: participationMethod }, { action: "/api/aoa/credentials", method: "POST" })
    setPm(participationMethod)
  }

  useDidMountEffect(() => {
    if (fetcher.data?.aoa) {
      exportAoa(fetcher.data?.aoa, `Credenciamento_Diário_${pm === "Escola" ? "Ensino Médio" : pm}`)
    }
  }, [fetcher.data?.aoa])

  return { downloadCredentialsSheet, isDownloadingCredentialsSheet, pm }
}
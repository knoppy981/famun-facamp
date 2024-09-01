import React from "react"
import { ParticipationMethod } from "@prisma/client"
import { useFetcher } from "@remix-run/react"
import { exportAoo } from "~/sheets"

export default function useParticipantsSheet(participationMethod: ParticipationMethod) {
  const fetcher = useFetcher<any>()
  let isDownloadingParticipantsSheet = fetcher.state !== "idle"
  const [downloadingSheet, setDownloadingSheet] = React.useState<"rg" | "cracha delegados" | "cracha orientadores" | null>(null)

  const downloadParticipantsSheet = (type: "rg" | "cracha delegados" | "cracha orientadores") => {
    setDownloadingSheet(type)
    const searchParams = new URLSearchParams([["pm", participationMethod], ["type", type]]);
    fetcher.load(`/api/aoo/participants?${searchParams}`)
  }

  React.useEffect(() => {
    if (fetcher.data?.aoo && fetcher.data?.type) {
      exportAoo(fetcher.data?.aoo, `Participantes_${participationMethod === "Escola" ? "Ensino Médio" : participationMethod}_${fetcher.data?.type}`)
    }
  }, [fetcher.data])

  return {downloadParticipantsSheet, isDownloadingParticipantsSheet, downloadingSheet}
}
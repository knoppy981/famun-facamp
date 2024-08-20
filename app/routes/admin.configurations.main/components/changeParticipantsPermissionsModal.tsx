import qs from "qs"
import { FetcherWithComponents, useFetcher } from '@remix-run/react'
import Button from '~/components/button'
import Dialog from '~/components/dialog'
import React from "react"

const ChangeParticipantsPermissionsModal = ({ close, status, type }: { close: () => void, status: boolean, type: "data" | "payment" | "document" }) => {
  const fetcher = useFetcher<any>()
  const [changeSubscriptionStatus] = useChangeParticipantsPermissions(close, fetcher, status, type)

  return (
    <Dialog maxWidth>
      <div className="dialog-title">
        Tem certeza que deseja {status ? "encerrar" : "liberar"} {type === "data" ? " a edição de dados" : type === "payment" ? "os pagamentos" : "o envio de documentos"} dos participantes?
      </div>

      <Button
        className="secondary-button-box blue-dark"
        onPress={close}
      >
        Cancelar
      </Button>

      <Button
        className={`secondary-button-box ${!status ? 'green-dark' : 'red-dark'}`}
        onPress={changeSubscriptionStatus}
        isDisabled={fetcher.state !== "idle"}
      >
        {fetcher.state !== "idle" ? status ? "Encerrando..." : "Liberando..." : status ? "Encerrar" : "Liberar"}
      </Button>
    </Dialog>
  )
}

function useChangeParticipantsPermissions(close: () => void, fetcher: FetcherWithComponents<any>, status: boolean, type: "data" | "payment" | "document"): [
  () => void
] {
  const changeSubscriptionStatus = () => {
    fetcher.submit(
      { changes: qs.stringify({ [type === "data" ? "allowParticipantsChangeData" : type === "payment" ? "allowParticipantsPayments" : "allowParticipantsSendDocuments"]: !status }) },
      { method: "post", action: "/admin/configurations" }
    )
  }

  React.useEffect(() => {
    if (fetcher.state === 'loading' && !fetcher.data?.errors) close()
  }, [fetcher.data])

  return [changeSubscriptionStatus]
}

export default ChangeParticipantsPermissionsModal

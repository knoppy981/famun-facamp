import qs from "qs"
import { FetcherWithComponents, useFetcher } from '@remix-run/react'
import Button from '~/components/button'
import Dialog from '~/components/dialog'
import React from "react"

const SubscriptionStatusModal = ({ close, status, type }: { close: () => void, status: boolean, type: "em" | "uni" }) => {
  const fetcher = useFetcher<any>()
  const [changeSubscriptionStatus] = useChangeSubscriptionStatus(close, fetcher, status, type)

  return (
    <Dialog maxWidth>
      <div className="dialog-title">
        Tem certeza que deseja {status ? "Fechar" : "Abrir"} as inscrições de {type === "em" ? "Ensino Médio" : "Universidade"}?
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
        {fetcher.state !== "idle" ? status ? "Fechando..." : "Abrindo..." : status ? "Fechar" : "Abrir"}
      </Button>
    </Dialog>
  )
}

function useChangeSubscriptionStatus(close: () => void, fetcher: FetcherWithComponents<any>, status: boolean, type: "em" | "uni"): [
  () => void
] {
  const changeSubscriptionStatus = () => {
    fetcher.submit(
      { changes: type === "em" ? JSON.stringify({ subscriptionEM: !status }) : JSON.stringify({ subscriptionUNI: !status }) },
      { method: "post", action: "/admin/configurations" }
    )
  }

  React.useEffect(() => {
    if (fetcher.state === 'loading' && !fetcher.data?.errors) close()
  }, [fetcher.data])

  return [changeSubscriptionStatus]
}

export default SubscriptionStatusModal

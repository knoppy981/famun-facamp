import React from "react";
import { FetcherWithComponents } from "@remix-run/react";
import { OverlayTriggerState, useOverlayTriggerState } from "react-stately";
import { adminDelegationType, modalContextType } from "./types";

export function useDelegationData(fetcher: FetcherWithComponents<any>,): [
  modalContextType,
  OverlayTriggerState,
  (delegation: adminDelegationType) => Promise<void>,
  any
] {
  const [modalContext, setModalContext] = React.useState<modalContextType>(null)
  const [aoo, setAoo] = React.useState<any>(null)
  const state = useOverlayTriggerState({});

  const handleSubmission = (delegationId: string) => {
    fetcher.load(`/api/adminDelegationData?delegationId=${delegationId}`)
  }

  const openModal = async (delegation: adminDelegationType) => {
    setAoo(null)
    setModalContext({
      ...delegation,
      paymentsCount: delegation._count.participants,
      documentsCount: delegation.participants.filter((participant: any) => participant._count.files > 0).length,
      amountPaid: 0,
    })
    handleSubmission(delegation.id)
    state.toggle()
  }

  React.useEffect(() => {
    if (fetcher.data?.delegation) {
      setModalContext((prevState: modalContextType) => {
        return {
          ...prevState,
          ...fetcher.data?.delegation,
        }
      })
    }

    if (fetcher.data?.aoo) {
      setAoo(fetcher.data?.aoo)
    }
  }, [fetcher.data])

  return [modalContext, state, openModal, aoo]
}
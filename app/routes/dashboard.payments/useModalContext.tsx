import React from "react";
import { OverlayTriggerState, useOverlayTriggerState } from "react-stately";
import Stripe from "stripe";

export function useModalContext(recentPayment: Stripe.PaymentIntent): [
  any, OverlayTriggerState
] {
  const [modalContext, setModalContext] = React.useState<any>()
  const state = useOverlayTriggerState({});

  React.useEffect(() => {
    if (recentPayment) {
      state.open()
      setModalContext({ status: recentPayment.status, metadata: recentPayment.metadata })
    }
  }, [recentPayment])

  return [modalContext, state]
}
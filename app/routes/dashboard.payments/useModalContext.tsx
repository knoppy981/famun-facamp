import React from "react";
import { OverlayTriggerState, useOverlayTriggerState } from "react-stately";
import Stripe from "stripe";

export function useModalContext(recentPayment: Stripe.PaymentIntent): [
  OverlayTriggerState
] {
  const state = useOverlayTriggerState({});

  React.useEffect(() => {
    if (recentPayment) {
      state.open()
    }
  }, [recentPayment])

  return [state]
}
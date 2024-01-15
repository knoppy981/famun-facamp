import React from "react";
import { FetcherWithComponents } from "@remix-run/react";
import { OverlayTriggerState, useOverlayTriggerState } from "react-stately";

export function useModalContext(fetcher: FetcherWithComponents<any>): [
  any, OverlayTriggerState
] {
  const [modalContext, setModalContext] = React.useState<any>()
  const state = useOverlayTriggerState({});

  React.useEffect(() => {
    if (fetcher.data?.user) {
      state.open()
      setModalContext(fetcher.data?.user)
    }
  }, [fetcher.data])

  return [modalContext, state]
}
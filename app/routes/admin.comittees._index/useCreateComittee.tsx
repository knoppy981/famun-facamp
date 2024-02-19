import React from "react";
import { FetcherWithComponents } from "@remix-run/react";
import { OverlayTriggerState, useOverlayTriggerState } from "react-stately";

export function useCreateComittee(fetcher: FetcherWithComponents<any>,): [
  OverlayTriggerState,
  () => void,
] {
  const state = useOverlayTriggerState({})

  const openModal = () => state.toggle()

  React.useEffect(() => {
    if (fetcher.data?.comittee) state.close()
  }, [fetcher.data])

  return [state, openModal]
}
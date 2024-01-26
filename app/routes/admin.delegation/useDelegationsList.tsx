import React from "react";
import { ParticipationMethod } from "@prisma/client";
import { FetcherWithComponents } from "@remix-run/react";
import { adminDelegationType } from "./types";

export function useDelegationsList(fetcher: FetcherWithComponents<any>, participationMethod: ParticipationMethod): [
  number | null,
  React.Dispatch<React.SetStateAction<number | null>>,
  adminDelegationType[]] {
  const [searchIndex, setSearchIndex] = React.useState<number | null>(0)
  const [delegations, setDelegations] = React.useState<adminDelegationType[]>([])

  const handleSubmission = (searchIndex: number, participationMethod: ParticipationMethod) => {
    fetcher.load(`/api/adminDelegationList?i=${searchIndex}&pm=${participationMethod}`)
  }

  React.useEffect(() => {
    setSearchIndex(0)
    setDelegations([])
    handleSubmission(0, participationMethod)
  }, [participationMethod])

  React.useEffect(() => {
    if (searchIndex !== null) handleSubmission(searchIndex, participationMethod)
  }, [searchIndex])

  React.useEffect(() => {
    if (fetcher.data?.delegations) {
      setDelegations(prevState => [...prevState, ...fetcher.data?.delegations])
      if (fetcher.data?.delegations.length < 12) setSearchIndex(null)
    }
  }, [fetcher.data])

  return [searchIndex, setSearchIndex, delegations]
}
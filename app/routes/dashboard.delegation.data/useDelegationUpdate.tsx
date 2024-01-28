import React from "react";
import { FetcherWithComponents } from "@remix-run/react";
import _ from 'lodash';
import qs from "qs"

import { DelegationType } from "~/models/delegation.server";
import { FetcherType } from "./route";

export function useDelegationUpdate(
  selectedUserId: string,
  setSelectedUserId: React.Dispatch<React.SetStateAction<string>>,
  allowChanges: boolean,
  delegation: DelegationType,
  fetcher: FetcherWithComponents<FetcherType>,
  removeParticipantFetcher: FetcherWithComponents<any>,
  changeLeaderFetcher: FetcherWithComponents<any>,
) {
  const data = fetcher.data as FetcherType
  const [formData, setFormData] = React.useState<DelegationType>(_.cloneDeep(delegation));
  const [readySubmission, setReadySubmission] = React.useState<boolean>(false)
  const [userWantsToChangeData, setUserWantsToChangeData] = React.useState<boolean>(false)
  const [allowChangeParticipant, setAllowChangeParticipant] = React.useState<boolean>(true)

  React.useEffect(() => {
    // if data is different from orginal data and the user clicked on the edit data button (userWantsToChangeData),
    // allow form submission and lock the user being edited, else don't
    if (!_.isEqual(delegation, formData) && userWantsToChangeData) {
      //different data
      setReadySubmission(true)
      if (_.isEqual(delegation.participants?.find(participant => participant.id === selectedUserId), formData.participants?.find(participant => participant.id === selectedUserId))) {
        // only block participant change if participants are different
        console.log("participants are equal")
        setAllowChangeParticipant(true)
      } else {
        setAllowChangeParticipant(false)
      }
    } else {
      setReadySubmission(false)
      setAllowChangeParticipant(true)
    }
  }, [formData])

  React.useEffect(() => {
    if (fetcher.state === 'loading' && !data.errors) {
      // change the delegation data for the updated one recieved from the server
      setFormData(_.cloneDeep<DelegationType>(fetcher.data as DelegationType))
      // set these variables to original state
      setReadySubmission(false)
      setUserWantsToChangeData(false)
      setAllowChangeParticipant(true)
      fetcher.data = undefined
    }
  }, [fetcher])

  const handleSubmission = () => {
    if (!allowChanges) return
    if (readySubmission) {
      fetcher.submit(
        { data: qs.stringify(formData), userId: allowChangeParticipant ? "" : selectedUserId },
        { method: "post", preventScrollReset: true, navigate: false }
      )
    } else {
      setUserWantsToChangeData(!userWantsToChangeData)
    }
  }

  // --------------------------------------------------------------------------------- //

  const handleRemoveParticipant = (participantId: string) => {
    removeParticipantFetcher.submit(
      { participantId, delegationId: delegation.id },
      { method: "post", action: "/api/removeDelegationParticipant" }
    )
  }

  React.useEffect(() => {
    if (removeParticipantFetcher.state === 'loading' && !removeParticipantFetcher.data.errors) {
      // change the delegation data for the updated one recieved from the server
      setFormData(_.cloneDeep<DelegationType>(removeParticipantFetcher.data?.delegation as DelegationType))
      // reset the selected user
      setSelectedUserId(removeParticipantFetcher.data?.delegation.participants?.[0].id as string)
      // set these variables to original state
      setReadySubmission(false)
      setUserWantsToChangeData(false)
      setAllowChangeParticipant(true)
      removeParticipantFetcher.data = undefined
    }
  }, [removeParticipantFetcher])

  const handleChangeLeader = (participantId: string) => {
    const leaderId = formData.participants?.find(participant => participant.leader)?.id as string
    changeLeaderFetcher.submit(
      { participantId, delegationId: delegation.id, leaderId },
      { method: "post", action: "/api/changeDelegationLeader" }
    )
  }

  return {
    readySubmission,
    userWantsToChangeData,
    handleSubmission,
    formData,
    setFormData,
    allowChangeParticipant,
    handleRemoveParticipant,
    handleChangeLeader,
  }
}
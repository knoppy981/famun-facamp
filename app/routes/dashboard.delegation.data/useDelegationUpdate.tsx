import React from "react";
import { FetcherWithComponents } from "@remix-run/react";
import _ from 'lodash';
import qs from "qs"

import { DelegationType } from "~/models/delegation.server";
import { FetcherType } from "./route";
import { UserType } from "~/models/user.server";

export function useDelegationUpdate(
  allowChanges: boolean,
  delegation: DelegationType,
  fetcher: FetcherWithComponents<FetcherType>,
  removeParticipantFetcher: FetcherWithComponents<any>,
  changeLeaderFetcher: FetcherWithComponents<any>,
): {
  selectedUserId: string | undefined,
  setSelectedUserId: React.Dispatch<React.SetStateAction<string | undefined>>,
  readySubmission: boolean,
  userWantsToChangeData: boolean,
  allowChangeParticipant: boolean,
  handleSubmission: () => void,
  handleChange: (type: "delegation" | "participant") => (e: any) => void,
  handleRemoveParticipant: (participantId: string) => void,
  handleChangeLeader: (participantId: string) => void
} {
  const [selectedUserId, setSelectedUserId] = React.useState<string | undefined>(delegation.participants?.[0].id);
  const [readySubmission, setReadySubmission] = React.useState<boolean>(false)
  const [userWantsToChangeData, setUserWantsToChangeData] = React.useState<boolean>(false)
  const [allowChangeParticipant, setAllowChangeParticipant] = React.useState<boolean>(true)
  const [delegationChanges, setDelegationChanges] = React.useState<{ [key: string]: any }>({});
  const [participantChanges, setParticipantsChanges] = React.useState<{ [key: string]: any }>({});

  React.useEffect(() => {
    // if input values are different than user data allow form submission
    setReadySubmission(Object.keys(delegationChanges).length > 0 || Object.keys(participantChanges).length > 0)
    setAllowChangeParticipant(Object.keys(participantChanges).length === 0)
  }, [delegationChanges, participantChanges])

  React.useEffect(() => {
    // if loading back data and no errors, set every state back to default
    if (fetcher.state === 'loading' && !fetcher.data?.errors) {
      setDelegationChanges({})
      setParticipantsChanges({})
      setReadySubmission(false)
      setUserWantsToChangeData(false)
      setAllowChangeParticipant(true)
    }
  }, [fetcher])

  const handleChange = (type: "delegation" | "participant") => {
    return type === "delegation" ?
      (e: any) => {
        const { name, value } = e.target;
        let defaultValue: any = undefined

        function isKeyOfUserType(key: any): key is keyof DelegationType {
          return key in delegation;
        }

        if (name.includes('.')) {
          const [field, nestedField] = name.split('.')

          if (isKeyOfUserType(field)) {
            let aux: any = delegation?.[field]
            defaultValue = aux?.[nestedField]
          }
        } else if (isKeyOfUserType(name)) {
          defaultValue = delegation?.[name]
        }

        setDelegationChanges((prevState: typeof delegationChanges) => {
          if (e?.delete) {
            delete prevState[name]
            return { ...prevState }
          }

          if (_.isEqual(defaultValue, value)) {
            delete prevState[name]
            return { ...prevState }
          } else {
            return { ...prevState, [name]: value }
          }
        })
      } :
      (e: any) => {
        const { name, value } = e.target;
        let defaultValue: any = undefined
        let user = delegation.participants?.find(participant => participant.id === selectedUserId) as UserType

        function isKeyOfUserType(key: any): key is keyof UserType {
          return key in user;
        }

        if (name.includes('.')) {
          const [field, nestedField] = name.split('.')

          if (isKeyOfUserType(field)) {
            let aux: any = user?.[field]
            defaultValue = aux?.[nestedField]
          }
        } else if (isKeyOfUserType(name)) {
          defaultValue = user?.[name]
        }

        setParticipantsChanges((prevState: typeof participantChanges) => {
          if (e?.delete) {
            delete prevState[name]
            return { ...prevState }
          }

          if (name === "socialName" && value === "") {
            delete prevState[name]
            return { ...prevState }
          }

          if (name === "nacionality" && (prevState.rg !== user.rg || prevState.passport !== user.passport)) {
            return { ...prevState, [name]: value }
          }

          if (prevState.nacionality && (name === "passport" || name === "rg" || name === "cpf")) {
            return { ...prevState, [name]: value }
          }

          if (name === "foodRestrictions.allergyDescription" && !user.foodRestrictions?.allergy) {
            return { ...prevState, [name]: value }
          }

          if (name === "foodRestrictions.allergyDescription" && value === "") {
            return { ...prevState, [name]: value, ["foodRestrictions.allergy"]: true }
          }

          if (_.isEqual(defaultValue, value)) {
            delete prevState[name]
            return { ...prevState }
          } else {
            return { ...prevState, [name]: value }
          }
        })
      }
  }

  const handleSubmission = () => {
    if (!allowChanges) return
    if (readySubmission) {
      fetcher.submit(
        { delegationChanges: qs.stringify(delegationChanges), participantChanges: qs.stringify(participantChanges), selectedUserId: selectedUserId as string },
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
      { method: "post", action: "/api/participant/delete", navigate: true }
    )
  }

  React.useEffect(() => {
    if (removeParticipantFetcher.state === 'loading' && !removeParticipantFetcher.data.errors) {
      // reset the selected user
      setSelectedUserId(delegation.participants?.filter(p => p.id !== selectedUserId)[0].id as string)
      // set these variables to original state
      setReadySubmission(false)
      setUserWantsToChangeData(false)
      setAllowChangeParticipant(true)
      removeParticipantFetcher.data = undefined
    }
  }, [removeParticipantFetcher])

  const handleChangeLeader = (participantId: string) => {
    const leaderId = delegation.participants?.find(participant => participant.leader)?.id as string
    changeLeaderFetcher.submit(
      { participantId, delegationId: delegation.id, leaderId },
      { method: "post", action: "/api/participant/delegation/leader", navigate: true }
    )
  }

  return {
    selectedUserId,
    setSelectedUserId,
    readySubmission,
    userWantsToChangeData,
    allowChangeParticipant,
    handleSubmission,
    handleChange,
    handleRemoveParticipant,
    handleChangeLeader
  }
}
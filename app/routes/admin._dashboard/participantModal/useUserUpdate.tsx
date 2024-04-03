import React from "react"
import qs from 'qs'
import _ from "lodash"

import { OverlayTriggerState } from "react-stately"
import { FetcherWithComponents } from "@remix-run/react"
import { UserType } from "~/models/user.server"

export function useUserUpdate(
  user: UserType,
  fetcher: FetcherWithComponents<any>,
  state: OverlayTriggerState,
  selectedMenu: "data" | "notifications" | "documents" | "payments",
  setSelectedMenu: React.Dispatch<React.SetStateAction<"notifications" | "data" | "documents" | "payments">>
): {
  readySubmission: boolean,
  userWantsToChangeData: boolean,
  handleSubmission: () => void,
  handleChange: (e: any) => void,
} {
  const [readySubmission, setReadySubmission] = React.useState<boolean>(false)
  const [userWantsToChangeData, setUserWantsToChangeData] = React.useState<boolean>(false)
  const [changes, setChanges] = React.useState<{ [key: string]: any }>({});

  React.useEffect(() => {
    // if input values are different than user data allow form submission
    setReadySubmission(Object.keys(changes).length > 0)
  }, [changes])

  React.useEffect(() => {
    // if loading back data and no errors, set every state back to default
    if ((fetcher.state === 'loading' && !fetcher.data?.errors) || !state.isOpen) {
      setChanges({})
      setReadySubmission(false)
      setUserWantsToChangeData(false)
    }
  }, [fetcher, state])

  React.useEffect(() => {
    setChanges({})
    setReadySubmission(false)
    setUserWantsToChangeData(false)
  }, [selectedMenu])

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    let defaultValue: any = undefined

    function isKeyOfUserType(key: any): key is keyof UserType {
      return key in user;
    }

    if (name.includes('.')) {
      const [field, nestedField, nested2Field] = name.split('.')

      if (isKeyOfUserType(field)) {
        let aux: any = user?.[field]
        defaultValue = nested2Field ? aux?.[nestedField]?.[nested2Field] : aux?.[nestedField]
      }
    } else if (isKeyOfUserType(name)) {
      defaultValue = user?.[name]
    }

    setChanges((prevState: typeof changes) => {
      if (e?.delete) {
        delete prevState[name]
        return { ...prevState }
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

  const handleSubmission = () => {
    if (readySubmission) {
      fetcher.submit(
        { changes: qs.stringify(changes), userId: user.id },
        { method: "post", preventScrollReset: true, navigate: false, action: "/admin/delegations/post" }
      )
    } else {
      setUserWantsToChangeData(!userWantsToChangeData)
    }
  }

  React.useEffect(() => {
    if (!state.isOpen) setSelectedMenu("data")
  }, [state])

  return {
    readySubmission,
    userWantsToChangeData,
    handleSubmission,
    handleChange,
  }
}
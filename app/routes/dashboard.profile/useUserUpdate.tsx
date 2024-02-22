import React from "react";
import { FetcherWithComponents } from "@remix-run/react";
import _ from "lodash"
import qs from "qs"

import { UserType } from "~/models/user.server";

export function useUserUpdate(user: UserType, fetcher: FetcherWithComponents<any>): {
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
    if (fetcher.state === 'loading' && !fetcher.data?.errors) {
      setChanges({})
      setReadySubmission(false)
      setUserWantsToChangeData(false)
    }
  }, [fetcher])

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    let defaultValue: any = undefined

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
        { changes: qs.stringify(changes) },
        { method: "post", preventScrollReset: true, navigate: false }
      )
    } else {
      setUserWantsToChangeData(!userWantsToChangeData)
    }
  }

  return {
    readySubmission,
    userWantsToChangeData,
    handleSubmission,
    handleChange,
  }
}
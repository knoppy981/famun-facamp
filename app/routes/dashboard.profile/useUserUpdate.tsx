import React from "react";
import { FetcherWithComponents } from "@remix-run/react";
import _ from "lodash"
import qs from "qs"

import { UserType } from "~/models/user.server";


export function useUserUpdate(user: UserType, fetcher: FetcherWithComponents<any>): {
  readySubmission: boolean,
  userWantsToChangeData: boolean,
  handleSubmission: () => void,
  formData: UserType,
  setFormData: React.Dispatch<React.SetStateAction<UserType>>
} {
  const [readySubmission, setReadySubmission] = React.useState<boolean>(false)
  const [userWantsToChangeData, setUserWantsToChangeData] = React.useState<boolean>(false)
  const [formData, setFormData] = React.useState<UserType>(_.cloneDeep(user));

  React.useEffect(() => {
    // if input values are different than user data allow form submission
    setReadySubmission(!_.isEqual(formData, user) && userWantsToChangeData)
  }, [formData])
  React.useEffect(() => {
    // if loading back data and no errors, set every state back to default
    if (fetcher.state === 'loading' && !fetcher.data?.errors) {
      setFormData(_.cloneDeep(fetcher.data))
      setReadySubmission(false)
      setUserWantsToChangeData(false)
    }
  }, [fetcher])

  const handleSubmission = () => {
    if (readySubmission) {
      fetcher.submit(
        { data: qs.stringify(formData) },
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
    formData,
    setFormData,
  }
}
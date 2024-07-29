import React from "react";
import { FetcherWithComponents } from "@remix-run/react";
import _ from "lodash"
import qs from "qs"
import { Configuration } from "@prisma/client";

export function useConfigurationsUpdate(configurations: Partial<Configuration>, fetcher: FetcherWithComponents<any>): {
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
    let { name, value } = e.target;
    let defaultValue: any = undefined

    function isKeyOfConfigurationType(key: any): key is keyof Configuration {
      return key in configurations;
    }

    if (name.includes('.')) {
      const [field, nestedField] = name.split('.')

      if (isKeyOfConfigurationType(field)) {
        let aux: any = configurations?.[field]
        defaultValue = aux?.[nestedField]
      }
    } else if (isKeyOfConfigurationType(name)) {
      defaultValue = configurations?.[name]
    }

    setChanges((prevState: typeof changes) => {
      if (typeof name === "string" && name.startsWith("conselhos") && Array.isArray(value) && Array.isArray(defaultValue)) {
        value = value.sort()
        defaultValue = defaultValue.sort()
      }

      if (Array.isArray(value) && value.length === 0) {
        if (defaultValue === undefined || defaultValue.length === 0) {
          delete prevState[name]
          return { ...prevState }
        } else {
          value = null
        }
      }
      if (name === "subscriptionAvailable" && typeof value === "string") value = value === "true"

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
        { method: "post", action: "/admin/configurations", preventScrollReset: true, navigate: false }
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
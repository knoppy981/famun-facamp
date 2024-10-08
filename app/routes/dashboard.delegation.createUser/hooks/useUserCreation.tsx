import React from "react"
import { FetcherWithComponents } from "@remix-run/react"
import _ from "lodash"
import qs from "qs"

import { UserType } from "~/models/user.server"
import { DelegationType } from "~/models/delegation.server"

const newUserDataDefaultValues = (councils: string[], participationMethod: string) => ({
  "delegate.councilPreference": councils,
  nacionality: "Brazil",
  participationMethod
})

export function useUserCreation(user: UserType, userType: "delegate" | "advisor" | undefined, fetcher: FetcherWithComponents<any>, delegatesCount: number, delegation: DelegationType, participationMethod: string, councils: string[], allow: boolean): {
  creatingUserType: string,
  changeCreatingUserType: (userType: "delegate" | "advisor") => void,
  creationPermission: { allowed: boolean, type: string } | undefined,
  handleChange: (e: any) => void,
  handleSubmission: () => void,
  editUserDataId: boolean
} {
  const [creatingUserType, setCreatingUserType] = React.useState("delegate")
  const [creationPermission, setCreationPermission] = React.useState<{ allowed: boolean, type: string } | undefined>(undefined)
  const [newUserData, setNewUserData] = React.useState<{ [key: string]: any }>(newUserDataDefaultValues(councils, participationMethod))
  const [editUserDataId, setEditUserDataId] = React.useState(false)

  React.useEffect(() => {
    // update the variable that decides if the user can create a user
    setCreationPermission(() => {
      if (userType === "advisor" || user.leader) {
        if (creatingUserType === "delegate") {
          return delegatesCount < delegation.maxParticipants ?
            { allowed: true, type: "" } :
            { allowed: false, type: "delegatesCount" }
        } else if (creatingUserType === "advisor") {
          return { allowed: true, type: "" }
        }
      } else {
        return { allowed: false, type: "userType" }
      }
    })
  }, [creatingUserType])

  React.useEffect(() => {
    // setting data back to default after creating user
    if (fetcher?.data?.newUser?.name) {
      setNewUserData(newUserDataDefaultValues)
      setEditUserDataId(prevValue => !prevValue)
      changeCreatingUserType("delegate")
      setCreationPermission(() => {
        if (fetcher.data.newUser && delegation.participants?.filter(p => p.delegate) && delegation.participants?.filter(p => p.delegate).length + 1 >= delegation.maxParticipants) {
          return { allowed: false, type: "delegatesCount" }
        } else {
          return { allowed: true, type: "" }
        }
      })
    }
  }, [fetcher.data])

  const changeCreatingUserType = (userType: "delegate" | "advisor") => {
    setNewUserData((prevState: any) => {
      let newData = { ...prevState }
      Object.keys(newData).forEach(key => {
        // Check if the current key includes the substring 'xab'
        if (key.includes(userType === "advisor" ? "delegate" : "delegationAdvisor")) {
          // If so, delete this key from the object
          delete newData[key];
        }
      });
      if (userType === "delegate") {
        newData["delegate.councilPreference"] = councils
      } else if (userType === "advisor") {
        newData["delegationAdvisor.advisorRole"] = "Professor"
      }
      return newData
    })
    setCreatingUserType(userType)
  }

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setNewUserData((prevState: { [key: string]: any }) => {
      return { ...prevState, [name]: value }
    })
  }

  const handleSubmission = () => {
    if (!creationPermission?.allowed || !allow) return
    fetcher.submit(
      { newUserData: qs.stringify(newUserData) },
      { method: "post", preventScrollReset: false, navigate: false }
    )
  }

  return {
    creatingUserType,
    changeCreatingUserType,
    creationPermission,
    handleChange,
    handleSubmission,
    editUserDataId
  }
}

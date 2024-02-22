import React from "react"
import { FetcherWithComponents } from "@remix-run/react"
import _ from "lodash"
import qs from "qs"

import { UserType } from "~/models/user.server"

const newUserDataDefaultValues = {
  "delegate.councilPreference": ['Conselho_de_Seguranca_da_ONU', 'Rio_92', 'Assembleia_Geral_da_ONU', 'Conselho_de_Juventude_da_ONU'],
  nacionality: "Brazil"
}

export function useUserCreation(user: UserType, userType: "delegate" | "advisor" | undefined, fetcher: FetcherWithComponents<any>, delegatesCount: number, delegationId: string, participationMethod: string): {
  creatingUserType: string,
  changeCreatingUserType: (userType: "delegate" | "advisor") => void,
  creationPermission: { allowed: boolean, type: string } | undefined,
  handleChange: (e: any) => void,
  handleSubmission: () => void,
  editUserDataId: boolean
} {
  const [creatingUserType, setCreatingUserType] = React.useState("delegate")
  const [creationPermission, setCreationPermission] = React.useState<{ allowed: boolean, type: string } | undefined>(undefined)
  const [newUserData, setNewUserData] = React.useState<{ [key: string]: any }>(newUserDataDefaultValues)
  const [editUserDataId, setEditUserDataId] = React.useState(false)

  React.useEffect(() => {
    console.log("newUserData: ")
    console.log(newUserData)
  }, [newUserData])

  React.useEffect(() => {
    // update the variable that decides if the user can create a user
    setCreationPermission(() => {
      if (userType === "advisor" || user.leader) {
        if (creatingUserType === "delegate") {
          return delegatesCount < 10 ?
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
        newData["delegate.councilPreference"] = ['Conselho_de_Seguranca_da_ONU', 'Rio_92', 'Assembleia_Geral_da_ONU', 'Conselho_de_Juventude_da_ONU']
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
    if (!creationPermission?.allowed) return
    fetcher.submit(
      { newUserData: qs.stringify(newUserData) },
      { method: "post", preventScrollReset: true, navigate: false }
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

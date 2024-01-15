import React from "react"
import { Council, Languages, ParticipationMethod } from "@prisma/client"
import { FetcherWithComponents } from "@remix-run/react"
import qs from "qs"

import { UserType } from "~/models/user.server"

export function useUserCreation(
  user: UserType,
  userType: "delegate" | "advisor" | undefined,
  fetcher: FetcherWithComponents<any>,
  delegatesCount: number,
  delegationId: string,
  participationMethod: string
): [
    string,
    (userType: "delegate" | "advisor") => void,
    { allowed: boolean, type: string } | undefined,
    UserType,
    React.Dispatch<React.SetStateAction<UserType>>,
    () => void
  ] {
  const normalUser = {
    id: '',
    email: '',
    name: '',
    rg: '',
    cpf: '',
    passport: '',
    phoneNumber: '',
    birthDate: '',
    nacionality: 'Brazil',
    delegate: {
      emergencyContactName: '',
      emergencyContactPhoneNumber: '',
      councilPreference: [
        'Conselho_de_Seguranca_da_ONU',
        'Rio_92',
        'Assembleia_Geral_da_ONU',
        'Conselho_de_Juventude_da_ONU'
      ] as Council[],
      languagesSimulates: [] as Languages[]
    },
    delegationAdvisor: {
      advisorRole: 'Professor',
      facebook: '',
      instagram: '',
      linkedin: ''
    }
  } as UserType

  const [creatingUserType, setCreatingUserType] = React.useState("delegate")
  const [creationPermission, setCreationPermission] = React.useState<{ allowed: boolean, type: string } | undefined>(undefined)
  const [formData, setFormData] = React.useState(normalUser)

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
    // update the default value for the user being created

  }, [creatingUserType])

  React.useEffect(() => {
    // setting data back to default after creating user
    if (fetcher?.data?.user?.name === formData.name)
      setFormData(() => {
        let newUser = { ...normalUser }
        newUser.id = fetcher.data.user.name
        return newUser
      })
  }, [fetcher.data])

  const changeCreatingUserType = (userType: "delegate" | "advisor") => {
    setFormData((prevState: any) => {
      let newData = { ...prevState }
      newData.delegate = userType === "delegate" ? normalUser.delegate : undefined
      newData.delegationAdvisor = userType === "advisor" ? normalUser.delegationAdvisor : undefined
      return newData
    })
    setCreatingUserType(userType)
  }

  const handleSubmission = () => {
    if (!creationPermission?.allowed) return
    fetcher.submit(
      { data: qs.stringify(formData), delegationId: delegationId, participationMethod },
      { method: "post", preventScrollReset: true, navigate: false }
    )
  }

  return [
    creatingUserType,
    changeCreatingUserType,
    creationPermission,
    formData,
    setFormData,
    handleSubmission
  ]
}

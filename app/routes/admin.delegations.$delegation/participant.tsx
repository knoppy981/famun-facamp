import React from "react"
import { AnimatePresence } from "framer-motion"
import qs from 'qs'
import _ from "lodash"

import Button from "~/components/button"
import Dialog from "~/components/dialog"
import Modal from "~/components/modalOverlay"
import { FiCheck, FiEdit, FiX } from "react-icons/fi/index.js";
import { OverlayTriggerState } from "react-stately"
import { FetcherWithComponents, useFetcher } from "@remix-run/react"
import { UserType } from "~/models/user.server"
import EditUserData from "../dashboard/edit-data-components/user"
import Spinner from "~/components/spinner"
import { Notifications } from "@prisma/client"

const ParticipantModal = ({ state, participant }: { state: OverlayTriggerState, participant: UserType & { notifications?: Notifications[] } }) => {
  const fetcher = useFetcher<any>()
  const { readySubmission, userWantsToChangeData, handleSubmission, handleChange, } =
    useUserUpdate(participant, fetcher, state)
  const [buttonLabel, buttonIcon, buttonColor] = useButtonState(userWantsToChangeData, readySubmission, fetcher.state)
  const [selectedMenu, setSelectedMenu] = React.useState<"data" | "notifications">("data")
  console.log(participant)

  return (
    <AnimatePresence>
      {state.isOpen &&
        <Modal state={state} isDismissable>
          <Dialog>
            <div className="admin-dialog-title">
              <h2>
                {participant.name}
              </h2>

              <Button onPress={state.close}>
                <FiX className='icon' />
              </Button>
            </div>

            <div className="admin-delegation-modal-button-container">
              <Button
                onPress={handleSubmission}
                className={`secondary-button-box ${buttonColor ? buttonColor + "-dark" : ""}`}
              >
                {buttonIcon} {buttonLabel}
              </Button>
            </div>

            {selectedMenu === "data" ?
              <EditUserData
                isDisabled={!userWantsToChangeData}
                actionData={fetcher.data}
                defaultValues={participant}
                handleChange={handleChange}
                id={""}
                userType={participant.delegate ? 'delegate' : 'delegationAdvisor'}
                actionType="edit"
                theme="dark"
              />
              :
              <div>
                {participant.notifications?.map(notification => (
                  <div>
                    {notification.description}
                  </div>
                ))}
              </div>
            }
          </Dialog>
        </Modal>
      }
    </AnimatePresence >
  )
}

function useUserUpdate(user: UserType, fetcher: FetcherWithComponents<any>, state: OverlayTriggerState): {
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

  React.useEffect(() => {
    // if loading back data and no errors, set every state back to default
    if (!state.isOpen) {
      setChanges({})
      setReadySubmission(false)
      setUserWantsToChangeData(false)
    }
  }, [state])

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
        { changes: qs.stringify(changes), userId: user.id },
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

function useButtonState(userWantsToChangeData: boolean, readySubmission: boolean, transition: "idle" | "loading" | "submitting") {
  const [buttonLabel, setButtonLabel] = React.useState<string>("Editar Dados")
  const [buttonIcon, setButtonIcon] = React.useState<React.ReactNode>(<FiEdit className="icon" />)
  const [buttonColor, setButtonColor] = React.useState<string>("blue")

  React.useEffect(() => {
    setButtonLabel(transition !== 'idle' ?
      "Salvando" :
      !userWantsToChangeData ?
        "Editar Dados" :
        readySubmission ?
          "Salvar Alterações" :
          "Cancelar")
    setButtonIcon(transition !== 'idle' ?
      <Spinner dim="18px" color='green' /> :
      !userWantsToChangeData ?
        <FiEdit className='icon' /> :
        readySubmission ?
          <FiCheck className='icon' /> :
          <FiX className='icon' />)
    setButtonColor(userWantsToChangeData ?
      readySubmission ? 'green' : 'red' :
      'blue')
  }, [userWantsToChangeData, readySubmission, transition])

  return [buttonLabel, buttonIcon, buttonColor]
}

export default ParticipantModal
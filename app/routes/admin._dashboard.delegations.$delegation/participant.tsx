import React from "react"
import { AnimatePresence } from "framer-motion"
import qs from 'qs'
import _ from "lodash"

import Button from "~/components/button"
import Dialog from "~/components/dialog"
import Modal from "~/components/modalOverlay"
import { FiBell, FiCheck, FiChevronDown, FiCreditCard, FiDownload, FiEdit, FiExternalLink, FiEye, FiFile, FiX } from "react-icons/fi/index.js";
import { OverlayTriggerState } from "react-stately"
import { FetcherWithComponents, useFetcher, useSubmit } from "@remix-run/react"
import { UserType } from "~/models/user.server"
import EditUserData from "../admin/edit-data-components/user"
import Spinner from "~/components/spinner"
import { Notifications } from "@prisma/client"
import keyToLabel from "~/utils/keyToLabel"
import Link from "~/components/link"

const ParticipantModal = ({ state, participant }: { state: OverlayTriggerState, participant: UserType & { notifications?: Notifications[] } }) => {
  const fetcher = useFetcher<any>()
  const [selectedMenu, setSelectedMenu] = React.useState<"data" | "notifications" | "documents" | "payments">("data")
  const { readySubmission, userWantsToChangeData, handleSubmission, handleChange } =
    useUserUpdate(participant, fetcher, state, selectedMenu, setSelectedMenu)
  const [buttonLabel, buttonIcon, buttonColor] = useButtonState(userWantsToChangeData, readySubmission, fetcher.state)

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
                onPress={() => selectedMenu === "data" ? handleSubmission() : setSelectedMenu("data")}
                className={`secondary-button-box ${selectedMenu === "data" ? buttonColor ? buttonColor + "-dark" : "" : "grey-dark"}`}
              >
                {buttonIcon} {buttonLabel}
              </Button>

              <Button
                onPress={() => setSelectedMenu("payments")}
                className={`secondary-button-box ${selectedMenu === "payments" ? buttonColor ? buttonColor + "-dark" : "" : "grey-dark"}`}
              >
                <FiCreditCard className="icon" /> Pagamentos
              </Button>

              {participant.files?.length && participant.files?.length > 0 ?
                <Button
                  onPress={() => setSelectedMenu("documents")}
                  className={`secondary-button-box ${selectedMenu === "documents" ? buttonColor ? buttonColor + "-dark" : "" : "grey-dark"}`}
                >
                  <FiFile className="icon" /> Documentos
                </Button>
                :
                null
              }

              {participant.notifications?.length && participant.notifications?.length > 0 ?
                <Button
                  onPress={() => setSelectedMenu("notifications")}
                  className={`secondary-button-box ${selectedMenu === "notifications" ? buttonColor ? buttonColor + "-dark" : "" : "grey-dark"}`}
                >
                  <FiBell className="icon" /> Notificações
                </Button>
                :
                null
              }
            </div>

            {selectedMenu === "data" ?
              <div>
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
              </div>
              :
              selectedMenu === "documents" ?
                <div>
                  {participant.files?.map((item, index) => <Document file={item} key={index} i={index} />)}
                </div>
                :
                <div>
                  {participant.notifications?.map((notification, index) => <Notification {...notification} key={index} i={index} />)}
                </div>
            }
          </Dialog>
        </Modal>
      }
    </AnimatePresence >
  )
}

function useUserUpdate(
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
        { method: "post", preventScrollReset: true, navigate: false }
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

function Notification(notification: {
  i: number;
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  seen: boolean;
  data: string;
  description: string | null;
  type: string;
  targetUserId: string | null;
  targetDelegationId: string | null;
}) {
  const [open, setOpen] = React.useState(false)
  const [data, handleSeeNotification] = handleNotification(notification.data, notification.seen, notification.id, open)

  return (
    <div className={`admin-delegation-notification ${notification.i !== 0 ? "border" : ""}`}>
      <div className={`admin-delegation-notification-date ${notification.seen ? "" : "not-seen"}`}>
        <p className="text">
          {new Date(notification.createdAt).toLocaleString('pt-BR', {
            timeZone: 'America/Sao_Paulo',
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
          })}
        </p>
      </div>

      <Button onPress={() => setOpen(!open)}>
        Mudanças <FiChevronDown className='icon' style={{ transform: `translateY(1px) ${open ? "rotate(-180deg)" : ""}` }} />
      </Button>

      <div className={`animate-height-container ${open ? "animate" : ""}`}>
        <div className="admin-delegation-notification-container">
          {data.map((item, index) => (
            <li key={index} className={`admin-delegation-notification-item ${Array.isArray(item.value) ? "array" : ""}`}>
              <div className="text italic">{keyToLabel(item.key)} : </div>
              {Array.isArray(item.value) ?
                <ul>
                  {item.value.map((value, i) => (
                    <li key={i} className="text italic">
                      {value}
                    </li>
                  ))}
                </ul> :
                <div className="text italic">{item.key === "sex" ? item.value === "Male" ? "Masculino" : "Feminino" : item.value}</div>
              }

            </li>
          ))}
        </div>
      </div>
    </div>
  )
}

function handleNotification(
  data: string,
  seen: boolean,
  id: string,
  open: boolean
): [
    { key: string; value: string; }[], (notificationId: string) => void
  ] {
  const submit = useSubmit()

  const handleSeeNotification = (notificationId: string) => {
    submit(
      { notificationId },
      { method: "post", action: "/api/adminNotification", navigate: false }
    )
  }

  React.useEffect(() => {
    if (open && !seen) {
      handleSeeNotification(id)
    }
  }, [open])

  const handleNotificationData = (dataString: string) => {
    return Object.entries(qs.parse(dataString))
      .map((item) => {
        const correctKey = item[0].split('.')
        return { key: correctKey[correctKey.length - 1], value: item[1] as string }
      })
  }

  return [handleNotificationData(data), handleSeeNotification]
}

function Document({ file, i }: {
  file: {
    id?: string;
    userId?: string;
    url?: string | null;
    name?: string;
    fileName?: string;
    stream?: Buffer;
    size?: number;
    createdAt?: Date;
  }, i: number
}) {
  return (
    <div className={`admin-delegation-notification ${i !== 0 ? "border" : ""}`}>
      <p className="text">
        {file.name}
      </p>

      <p className="text italic">{file.fileName} {file.size ? " - " + formatBytes(file.size) : null}</p>

      <div className="admin-delegation-documents-buttons-container">
        <Button
          onPress={() => handleFileView(file.id as string)}
          className="secondary-button-box blue-dark"
        >
          <FiExternalLink className="icon" /> Visualizar
        </Button>

        <Link
          to={`/api/dfb?fileId=${file.id}`}
          reloadDocument
          className="secondary-button-box green-dark link"
        >
          <div className='button-child'>
            <FiDownload className="icon" /> Baixar
          </div>
        </Link>
      </div>
    </div>
  )
}

async function handleFileView(fileId: string) {
  try {
    const response = await fetch('/api/gfb', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileId }),
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);
    window.open(imageUrl, '_blank');
  } catch (error) {
    console.error('Error fetching the image:', error);
  }
}

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes'

  const k = 1000
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export default ParticipantModal
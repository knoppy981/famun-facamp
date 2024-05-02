import React from "react"
import { AnimatePresence } from "framer-motion"
import { useFetcher } from "@remix-run/react"
import { OverlayTriggerState } from "react-stately"
import { Notifications } from "@prisma/client"

import { UserType } from "~/models/user.server"
import { useUserUpdate } from "./useUserUpdate"
import { useButtonState } from "./useButtonState"

import Button from "~/components/button"
import Dialog from "~/components/dialog"
import Modal from "~/components/modalOverlay"
import { FiBell, FiCreditCard, FiFile, FiX } from "react-icons/fi/index.js";
import EditUserData from "~/routes/admin._dashboard/edit-data-components/user"
import Documents from "./documents"
import NotificationsContainer from "./notifications"
import Payments from "./payments"

type menus = "notifications" | "data" | "documents" | "payments"

const ParticipantModal = ({ state, participant }: { state: OverlayTriggerState, participant: UserType & { notifications?: Notifications[] } }) => {
  const fetcher = useFetcher<any>()
  const [selectedMenu, setSelectedMenu] = React.useState<menus>("data")
  const { readySubmission, userWantsToChangeData, handleSubmission, handleChange } =
    useUserUpdate(participant, fetcher, state, selectedMenu, setSelectedMenu)
  const [buttonLabel, buttonIcon, buttonColor] =
    useButtonState(userWantsToChangeData, readySubmission, fetcher.state)

  const menus = [
    { index: "data" as menus, display: <>{buttonIcon} {buttonLabel}</>, isVisible: true, action: handleSubmission },
    { index: "payments" as menus, display: <><FiCreditCard className="icon" /> Pagamentos</>, isVisible: true },
    { index: "documents" as menus, display: <><FiFile className="icon" /> Documentos</>, isVisible: true },
    { index: "notifications" as menus, display: <><FiBell className="icon" /> Notificações</>, isVisible: participant?.notifications?.length && participant.notifications?.length > 0 },
  ]

  const menu = () => {
    switch (selectedMenu) {
      case "data":
        return <EditUserData
          isDisabled={!userWantsToChangeData}
          actionData={fetcher.data}
          defaultValues={participant}
          handleChange={handleChange}
          id={""}
          userType={participant.delegate ? 'delegate' : 'delegationAdvisor'}
          actionType="edit"
          theme="dark"
        />
      case "payments":
        return <Payments
          stripeCustomerId={participant.stripeCustomerId}
          stripePaid={participant.stripePaid}
          userId={participant.id}
        />
      case "documents":
        return <Documents participant={participant} />
      case "notifications":
        return <NotificationsContainer participant={participant} />
      default:
        return null
    }
  }

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
              {menus.map((item, index) => {
                if (!item.isVisible) return
                return (
                  <Button
                    key={index}
                    onPress={() => {
                      if (selectedMenu === item.index && item.action) {
                        item.action()
                      } else {
                        setSelectedMenu(item.index)
                      }
                    }}
                    className={`secondary-button-box ${selectedMenu === item.index ? buttonColor ? buttonColor + "-dark" : "" : "grey-dark"}`}
                  >
                    {item.display}
                  </Button>
                )
              })}
            </div>

            {menu()}
          </Dialog>
        </Modal>
      }
    </AnimatePresence >
  )
}

export default ParticipantModal
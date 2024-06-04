import React from "react"
import { AnimatePresence } from "framer-motion"
import { OverlayTriggerState, useOverlayTriggerState } from "react-stately"
import { Notifications } from "@prisma/client"

import { UserType } from "~/models/user.server"

import Button from "~/components/button"
import Dialog from "~/components/dialog"
import Modal from "~/components/modalOverlay"
import { FiBell, FiCreditCard, FiFile, FiMenu, FiUser, FiUserMinus, FiX } from "react-icons/fi/index.js";
import Documents from "./documents"
import NotificationsContainer from "./notifications"
import Payments from "./payments"
import DeleteParticipant from "./deleteParticipant"
import EditData from "./editData"

type menus = "notifications" | "data" | "documents" | "payments" | "delete"

const ParticipantModal = ({ state, participant }: { state: OverlayTriggerState, participant: UserType & { notifications?: Notifications[] } }) => {
  const [selectedMenu, setSelectedMenu] = React.useState<menus>("data")
  const removeParticipantsState = useOverlayTriggerState({})

  const menus = [
    {
      index: "data" as menus,
      display: <><FiUser className="icon" /> Dados</>,
      isVisible: true,
    },
    {
      index: "payments" as menus,
      display: <><FiCreditCard className="icon" /> Pagamentos</>,
      isVisible: true
    },
    {
      index: "documents" as menus,
      display: <><FiFile className="icon" /> Documentos</>,
      isVisible: true
    },
    {
      index: "notifications" as menus,
      display: <><FiBell className="icon" /> Notificações</>,
      isVisible: participant?.notifications?.length && participant.notifications?.length > 0 ? true : false
    },
    {
      index: "delete" as menus,
      display:
        <>
          <div className='committee-title'>
            <Button
              className='secondary-button-box red-dark'
              onPress={removeParticipantsState.toggle}
            >
              <FiUserMinus className='icon' /> Remover Participantes
            </Button>
          </div>

          <DeleteParticipant state={removeParticipantsState} parentState={state} participant={participant} />
        </>,
      isVisible: true
    },
  ]

  const renderMenu = () => {
    switch (selectedMenu) {
      case "data":
        return <EditData
          participant={participant}
          selectedMenu={selectedMenu}
          setSelectedMenu={setSelectedMenu}
          state={state}
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

            <div className="admin-delegation-modal-button-container disappear">
              {menus.map((item, index) => {
                if (item.index === "delete") return <React.Fragment key="delete"> {item.display} </React.Fragment>
                return (
                  <Button
                    key={index}
                    onPress={() => {
                      setSelectedMenu(item.index)
                    }}
                    className={`secondary-button-box ${selectedMenu === item.index ? "blue-dark" : ""}`}
                  >
                    {item.display}
                  </Button>
                )
              })}
            </div>

            <Navbar selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} menus={menus} state={state} />

            {renderMenu()}
          </Dialog>
        </Modal>
      }
    </AnimatePresence >
  )
}

function Navbar({ selectedMenu, setSelectedMenu, menus, state }: {
  selectedMenu: menus;
  setSelectedMenu: React.Dispatch<React.SetStateAction<menus>>;
  menus: { index: menus; display: JSX.Element; isVisible: boolean; }[],
  state: OverlayTriggerState
}) {
  const [open, setOpen] = React.useState(false)

  const toggle = () => setOpen(!open)

  React.useEffect(() => {
    const handleResize = () => {
      setOpen(false)
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [])

  React.useEffect(() => {
    if (state.isOpen) setSelectedMenu("data")
  }, [state.isOpen])

  return (
    <>
      <div className="admin-delegation-modal-button-container disappear reverse">
        <Button onPress={toggle}>
          {open ? <FiX style={{ fontSize: "2.4rem" }} /> : <FiMenu style={{ fontSize: "2.4rem" }} />}
        </Button>

        <div className="secondary-button-box blue-dark">
          <div className='button-child'>
            {menus.find(m => selectedMenu === m.index)?.display}
          </div>
        </div>
      </div>

      <div className={`animate-height-container ${open ? "animate" : ""}`}>
        <div className="admin-delegation-modal-button-list">
          {menus.filter(m => m.index !== selectedMenu).map((item, index) => {
            if (item.index === "delete") return (
              <div style={{ marginBottom: "10px" }} key="delete">
                {item.display}
              </div>
            )
            return (
              <Button
                key={index}
                onPress={() => {
                  toggle()
                  setSelectedMenu(item.index)
                }}
                className="admin-delegation-modal-button-list-item"
              >
                {item.display}
              </Button>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default ParticipantModal
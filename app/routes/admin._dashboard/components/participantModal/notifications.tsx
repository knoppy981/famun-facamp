import React from "react";
import qs from 'qs'
import { useSubmit } from "@remix-run/react";

import keyToLabel from "~/utils/keyToLabel";

import Button from "~/components/button";
import { FiChevronDown } from "react-icons/fi/index.js";
import { UserType } from "~/models/user.server";
import { Notifications } from "@prisma/client";

const NotificationsContainer = ({ participant }: { participant: UserType & { notifications?: Notifications[] } }) => {
  if (participant.notifications?.length === 0) return <div className="text italic">
    Nenhuma notoficação
  </div>

  return <div>
    {participant.notifications?.map((notification, index) => <Notification {...notification} key={index} i={index} />)}
  </div>
}

const Notification = (notification: {
  i: number;
  id: string;
  userId: string | null;
  createdAt: Date;
  updatedAt: Date;
  seen: boolean;
  data: string;
  description: string | null;
  type: string;
  targetUserId: string | null;
  targetDelegationId: string | null;
}) => {
  const [open, setOpen] = React.useState(false)
  const [data, handleSeeNotification] = handleNotification(notification.data, notification.type, notification.description ?? "", notification.seen, notification.id, open)

  return (
    <div className={`admin-delegation-notification`}>
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
        {notification.type === "document" ? "Envio de Documento" : "Mudanças"} <FiChevronDown className='icon' style={{ transform: `translateY(1px) ${open ? "rotate(-180deg)" : ""}` }} />
      </Button>

      <div className={`animate-height-container ${open ? "animate" : ""}`}>
        <div className="admin-delegation-notification-container">
          {data.map((item, index) => item.value !== '' ? (
            <li key={index} className={`admin-delegation-notification-item ${Array.isArray(item.value) ? "array" : ""}`}>
              <div className="text italic">{item.type !== "document" ? keyToLabel(item.key) : item.key}: </div>
              {Array.isArray(item.value) ?
                <ul>
                  {item.value.map((value, i) => (
                    <li key={i} className="text italic">
                      {value}
                    </li>
                  ))}
                </ul> :
                <div className="text italic">{item.key === "sex" ? item.value : item.value === "true" ? "Adicionada" : item.value === "false" ? "Removida" : item.value}</div>
              }

            </li>
          ) : null)}
        </div>
      </div>
    </div>
  )
}

function handleNotification(
  data: string,
  type: string,
  description: string,
  seen: boolean,
  id: string,
  open: boolean
): [
    {
      key: string;
      value: string;
      type: string;
    }[],
    (notificationId: string) => void
  ] {
  const submit = useSubmit()

  const handleSeeNotification = (notificationId: string) => {
    submit(
      { notificationId },
      { method: "post", action: "/api/admin/notification", navigate: false }
    )
  }

  React.useEffect(() => {
    if (open && !seen) {
      handleSeeNotification(id)
    }
  }, [open])

  const handleNotificationData = (dataString: string, type: string, description: string) => {
    return type !== "document" ?
      Object.entries(qs.parse(dataString))
        .map((item) => {
          const correctKey = item[0].split('.')
          return { key: correctKey[correctKey.length - 1], value: item[1] as string, type }
        })
      :
      [{ key: description, value: dataString, type }]
  }

  const formattedData = handleNotificationData(data, type, description)

  return [formattedData, handleSeeNotification]
}

export default NotificationsContainer
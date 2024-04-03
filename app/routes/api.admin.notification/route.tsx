import React from 'react'
import { ActionFunctionArgs, json } from '@remix-run/node'
import { requireAdminId } from '~/session.server';
import { seeNotification } from '~/models/notifications.server';

export const action = async ({ request }: ActionFunctionArgs) => {
  await requireAdminId(request)

  const formData = await request.formData()
  const notificationId = formData.get("notificationId")
  let notification

  try {
    if (typeof notificationId === "string") {
      notification = await seeNotification(notificationId)
    }
  } catch (error) {
    console.log(error)
    return json(
      { errors: { deleteDelegation: "Failed updating notification" } },
      { status: 400 }
    )
  }

  return json({ notification })
}
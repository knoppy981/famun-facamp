import React from 'react'
import { ActionFunctionArgs, json } from '@remix-run/node'
import { requireAdminId } from '~/session.server';
import { seeNotification } from '~/models/notifications.server';
import { toggleFakePayment } from '~/models/payments.server';

export const action = async ({ request }: ActionFunctionArgs) => {
  await requireAdminId(request)

  const formData = await request.formData()
  const stripePaidId = formData.get("stripePaidId")
  const userId = formData.get("userId")

  console.log(stripePaidId, userId)

  try {
    if (typeof userId === "string" && (stripePaidId === "null" || stripePaidId === "fake_payment")) {
      console.log("passed")
      console.log(stripePaidId)
      const user = await toggleFakePayment(userId, stripePaidId === "fake_payment")
      console.log(user)
    }
  } catch (error) {
    console.log(error)
    return json(
      { errors: { deleteDelegation: "Failed updating notification" } },
      { status: 400 }
    )
  }

  return json({})
}
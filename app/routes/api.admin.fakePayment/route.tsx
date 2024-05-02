import React from 'react'
import { ActionFunctionArgs, json } from '@remix-run/node'
import { requireAdminId } from '~/session.server';
import { seeNotification } from '~/models/notifications.server';
import { toggleFakePayment } from '~/models/payments.server';

export const action = async ({ request }: ActionFunctionArgs) => {
  await requireAdminId(request)

  const formData = await request.formData()
  const userId = formData.get("userId")
  const amount = formData.get("amount") as string
  const currency = formData.get("currency") as string
  const status = formData.get("status")

  try {
    if (typeof userId === "string" && typeof status === "string" && (status === "null" || status === "fake")) {
      console.log("passed")
      console.log(status) 
      const user = await toggleFakePayment(userId, status === "fake", amount, currency)
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
// postpone payment due
import React from 'react'
import { ActionFunctionArgs, json } from '@remix-run/node'
import { requireAdminId } from '~/session.server';
import { postponeDelegationPaymentDue } from '~/models/payments.server';

export const action = async ({ request }: ActionFunctionArgs) => {
  await requireAdminId(request)

  const formData = await request.formData()
  const delegationId = formData.get("delegationId")
  let delegation

  try {
    if (typeof delegationId === "string" && delegationId !== "") {
      delegation = await postponeDelegationPaymentDue(delegationId)
    }
  } catch (error) {
    console.log(error)
    return json(
      { errors: { adminAction: "Failed action" } },
      { status: 400 }
    )
  }

  return json({ delegation })
}
import React from 'react'
import { ActionFunctionArgs, json } from '@remix-run/node'
import { deleteDelegation } from '~/models/delegation.server'
import { requireAdminId } from '~/session.server';

export const action = async ({ request }: ActionFunctionArgs) => {
  await requireAdminId(request)

  const formData = await request.formData()
  const delegationId = formData.get("delegationId")
  let delegation

  try {
    if (typeof delegationId === "string" && delegationId !== "") {
      delegation = await deleteDelegation(delegationId)
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
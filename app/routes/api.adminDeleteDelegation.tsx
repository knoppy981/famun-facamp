import React from 'react'
import { ActionFunctionArgs, json } from '@remix-run/node'
import { DelegationType, adminDelegationData, deleteDelegation } from '~/models/delegation.server'
import { delegationAoo } from '~/sheets/data';
import { getDelegationCharges } from '~/stripe.server';
import { requireAdminId } from '~/session.server';

export const action = async ({ request }: ActionFunctionArgs) => {
  await requireAdminId(request)

  const formData = await request.formData()
  const delegationId = formData.get("delegationId")
  let delegation

  try {
    if (typeof delegationId === "string") {
      delegation = await deleteDelegation(delegationId)
    }
  } catch (error) {
    console.log(error)
    return json(
      { errors: { deleteDelegation: "Failed deleting delegation" } },
      { status: 400 }
    )
  }

  return json({ delegation })
}
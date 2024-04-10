import React from 'react'
import { ActionFunctionArgs, json } from '@remix-run/node'
import { requireAdminId } from '~/session.server';
import { prisma } from "~/db.server";


export const action = async ({ request }: ActionFunctionArgs) => {
  await requireAdminId(request)

  const formData = await request.formData()
  const delegationId = formData.get("delegationId")
  const maxParticipants = formData.get("maxParticipants")
  let delegation

  try {
    if (typeof delegationId === "string" && delegationId !== "" && Number(maxParticipants) > 0 && Number(maxParticipants) <= 20) {
      delegation = await changeMaxParticipants(delegationId as string, Number(maxParticipants))
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

async function changeMaxParticipants(delegationId: string, maxParticipants: number) {
  return prisma.delegation.update({
    where: {
      id: delegationId
    },
    data: {
      maxParticipants
    }
  })
}
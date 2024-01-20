import { ParticipationMethod } from '@prisma/client';
import { LoaderFunctionArgs, json } from '@remix-run/node'
import React from 'react'
import { adminDelegationsList } from '~/models/delegation.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const searchIndex = url.searchParams.get("i");
  const participationMethod = url.searchParams.get("pm") as ParticipationMethod

  const delegations = await adminDelegationsList(Number(searchIndex), participationMethod)

  return json({ delegations })
}
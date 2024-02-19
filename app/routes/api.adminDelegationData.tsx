import React from 'react'
import { LoaderFunctionArgs, json } from '@remix-run/node'
import { DelegationType, adminDelegationData } from '~/models/delegation.server'
import { delegationAoo } from '~/sheets/data';
import { getDelegationCharges } from '~/stripe.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const delegationId = url.searchParams.get("delegationId");

  if (!delegationId) throw json({ errors: { delegation: "delegation not found" } })

  const delegation = await adminDelegationData(delegationId)

  const delegationCharges = await getDelegationCharges(delegation as DelegationType)

  let amountPaid = delegationCharges?.data.reduce((accumulator, charge) => {
    accumulator += charge.amount
    return accumulator
  }, 0) as number

  return json({ delegation: { ...delegation, amountPaid } })
}
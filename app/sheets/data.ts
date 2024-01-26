import { DelegationType } from "~/models/delegation.server";
import { getDelegationCharges } from "~/stripe.server";
import qs from 'qs'
import Stripe from "stripe";

export type delegationAoo = {
  "Number of Delegation"?: string,
  "Head Delegate"?: string,
  "School and city"?: string,
  "Total number of paid delegates"?: number,
  "Total number of FA paid"?: number,
  "Delegates"?: number,
  "FA's"?: number,
  "Full name"?: string,
  "Waiver"?: number,
  "Amount Paid"?: number,
  "Status"?: string,
  "Registration date"?: string,
  "Second deadline"?: string,
  "comments"?: string
}[]

export const delegationAoo = async (delegation: DelegationType, amountPaid: number) => {
  const delegates = delegation?.participants?.filter((participant) => participant.delegate !== null && participant.id)
  const advisors = delegation?.participants?.filter((participant) => participant.delegationAdvisor !== null && participant.id)

  let advisorsPaid = advisors?.reduce((accumulator, delegate) => {
    if (delegate.stripePaydId) accumulator += 1
    return accumulator
  }, 0) as number

  let delegatesPaid = delegates?.reduce((accumulator, delegate) => {
    if (delegate.stripePaydId) accumulator += 1
    return accumulator
  }, 0) as number

  let participantsWithLiabilityWaiverSent = delegation.participants?.reduce((accumulator, participant) => {
    if (participant.files?.filter(file => file.name === "Liability Waiver").length === 1) accumulator += 1
    return accumulator
  }, 0) as number

  const aoo: delegationAoo = [
    {
      "Number of Delegation": delegation.id,
      "Head Delegate": delegation.participants?.find(participant => participant.leader)?.name,
      "School and city": `${delegation.school}, ${delegation.address?.city}`,
      "Total number of paid delegates": delegatesPaid,
      "Total number of FA paid": advisorsPaid,
      "Delegates": delegates?.length,
      "FA's": advisors?.length,
      "Full name": "",
      "Waiver": participantsWithLiabilityWaiverSent,
      "Amount Paid": amountPaid,
      "Status": "",
      "Registration date": delegation.createdAt.toLocaleDateString("pt-BR"),
      "Second deadline": "",
      "comments": ""
    },
  ]

  delegates?.forEach(participant => {
    aoo.push({
      "Delegates": 1,
      "Full name": participant.name,
      "Waiver": participant.files?.find(file => file.name === "Liability Waiver") ? 1 : 0,
      "Amount Paid": participant.stripePaydId ? 150 : 0,
      "Status": participant.stripePaydId ? "Pago" : "Não pago",
      "Registration date": delegation.createdAt.toLocaleDateString("pt-BR"),
    })
  })

  advisors?.forEach(participant => {
    aoo.push({
      "FA's": 1,
      "Full name": participant.name,
      "Waiver": participant.files?.find(file => file.name === "Liability Waiver") ? 1 : 0,
      "Amount Paid": participant.stripePaydId ? 30 : 0,
      "Status": participant.stripePaydId ? "Pago" : "Não pago",
      "Registration date": delegation.createdAt.toLocaleDateString("pt-BR"),
    })
  })

  return aoo
}
import _ from "lodash"
import { DelegationType } from "~/models/delegation.server";
import { getDelegationCharges } from "~/stripe.server";

type DelegationAooType = Partial<{
  "Number of Delegation": string,
  "Head Delegate": string,
  "School and city": string,
  "Total number of paid delegates": number,
  "Total number of FA paid": number,
  "Delegates": number,
  "FA's": number,
  "E-mail": string,
  "Full name": string,
  "Social Name": string,
  "CPF": string,
  "RG": string,
  "Passport": string,
  "Phone Number": string,
  "Birth Date": string,
  "Nacionality": string,
  "Sex": string,
  "Emergnecy Contact Name": string,
  "Emergnecy Contact Phone": string,
  "Education Level": string,
  "Current Year": string,
  "Languages": string,
  "Committee": string,
  "Representation": string,
  "Waiver": number,
  "Amount Paid": string,
  "Status": string,
  "Registration date": string,
  "Second deadline": string,
  "comments": string
}>[]

export async function delegationsAoo(delegations: DelegationType[]) {
  let aoo: DelegationAooType = []

  delegations.forEach((delegation) => {
    const amountPaid: { "usd": number, "brl": number } = { "usd": 0, "brl": 0 }
    delegation.participants?.forEach(participant => {
      const amount = participant.stripePaid?.amount
      const currency = participant.stripePaid?.currency
      if (amount && currency) {
        if (currency) {
          amountPaid[currency.toLocaleLowerCase() as "usd" | "brl"] += parseInt(amount)
        } else {
          amountPaid[currency.toLocaleLowerCase() as "usd" | "brl"] = parseInt(amount)
        }
      }
    });
    const paidString = `${amountPaid.brl > 0 ? (amountPaid.brl / 100).toLocaleString("pt-BR", { style: "currency", currency: "brl" }) : ""}${amountPaid.usd > 0 ? (amountPaid.usd / 100).toLocaleString("pt-BR", { style: "currency", currency: "usd" }) : ""}`.trim()

    aoo.push(...delegationAoo(delegation, paidString))
  })

  return aoo
}

function delegationAoo(delegation: DelegationType, amountPaid: string) {
  const delegates = delegation?.participants?.filter((participant) => participant.delegate !== null && participant.id)
  const advisors = delegation?.participants?.filter((participant) => participant.delegationAdvisor !== null && participant.id)

  let advisorsPaid = advisors?.reduce((accumulator, delegate) => {
    if (delegate.stripePaid) accumulator += 1
    return accumulator
  }, 0) as number

  let delegatesPaid = delegates?.reduce((accumulator, delegate) => {
    if (delegate.stripePaid) accumulator += 1
    return accumulator
  }, 0) as number

  let participantsWithLiabilityWaiverSent = delegation.participants?.reduce((accumulator, participant) => {
    if (participant.files?.filter(file => file.name === "Liability Waiver").length === 1) accumulator += 1
    return accumulator
  }, 0) as number

  const aoo: DelegationAooType = [
    {
      "Number of Delegation": delegation.id,
      "Head Delegate": delegation.participants?.find(participant => participant.leader)?.name,
      "School and city": `${delegation.school}, ${delegation.address?.city}`,
      "Total number of paid delegates": delegatesPaid,
      "Total number of FA paid": advisorsPaid,
      "Delegates": delegation.maxParticipants,
      "FA's": advisors?.length,
      "Full name": "",
      "Waiver": participantsWithLiabilityWaiverSent,
      "Amount Paid": amountPaid,
      "Status": "",
      "Registration date": typeof delegation.createdAt === "string" ? new Date(delegation.createdAt).toLocaleDateString("pt-BR") : delegation.createdAt.toLocaleDateString("pt-BR"),
      "Second deadline": "",
      "comments": ""
    },
  ]

  delegates?.forEach(participant => {
    aoo.push({
      "Delegates": 1,
      "Full name": participant.name,
      "Waiver": participant.files?.some(file => file.name === "Liability Waiver") ? 1 : 0,
      "Amount Paid": participant.stripePaid ? `${(parseInt(participant.stripePaid.amount) / 100).toLocaleString("pt-BR", { style: "currency", currency: participant.stripePaid.currency })}` : "0",
      "Status": participant.stripePaid ? "Pago" : "Não pago",
      "Registration date": typeof participant.createdAt === "string" ? new Date(participant.createdAt).toLocaleDateString("pt-BR") : participant.createdAt.toLocaleDateString("pt-BR"),
    })
  })

  advisors?.forEach(participant => {
    aoo.push({
      "FA's": 1,
      "Full name": participant.name,
      "Waiver": participant.files?.find(file => file.name === "Liability Waiver") ? 1 : 0,
      "Amount Paid": participant.stripePaid ? `${(parseInt(participant.stripePaid.amount) / 100).toLocaleString("pt-BR", { style: "currency", currency: participant.stripePaid.currency })}` : "0",
      "Status": participant.stripePaid ? "Pago" : "Não pago",
      "Registration date": typeof participant.createdAt === "string" ? new Date(participant.createdAt).toLocaleDateString("pt-BR") : participant.createdAt.toLocaleDateString("pt-BR"),
    })
  })

  return aoo
}
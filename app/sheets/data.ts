import _ from "lodash"
import { DelegationType } from "~/models/delegation.server";
import { UserType } from "~/models/user.server";
import { ComitteeType } from "~/routes/admin._dashboard.comittees.$comittee/route";
import { getDelegationCharges } from "~/stripe.server";

export type DelegationAooType = {
  "Number of Delegation"?: string,
  "Head Delegate"?: string,
  "School and city"?: string,
  "Total number of paid delegates"?: number,
  "Total number of FA paid"?: number,
  "Delegates"?: number,
  "FA's"?: number,
  "Full name"?: string,
  "Waiver"?: number,
  "Amount Paid"?: string,
  "Status"?: string,
  "Registration date"?: string,
  "Second deadline"?: string,
  "comments"?: string
}[]

export type ComitteeAooType = {
  "Representation"?: string,
  "School"?: string,
  "Delegate"?: string,
  "Head Delegate"?: string,
  "Position Paper"?: number,
  "Male"?: number,
  "Female"?: number,
}[]

export async function delegationsAoo(delegations: DelegationType[]) {
  let aoo: DelegationAooType = []

  const promises = delegations.map(async (delegation) => {
    const delegationCharges = await getDelegationCharges(delegation as any)
    const amountPaid: { "usd": number, "brl": number } = { "usd": 0, "brl": 0 }
    delegationCharges?.data.forEach(charge => {
      if (amountPaid[charge.currency as "usd" | "brl"]) {
        amountPaid[charge.currency as "usd" | "brl"] += charge.amount
      } else {
        amountPaid[charge.currency as "usd" | "brl"] = charge.amount
      }
    });
    const paidString = `
      ${amountPaid.brl > 0 ? (amountPaid.brl / 100).toLocaleString("pt-BR", { style: "currency", currency: "brl" }) : ""}
      ${amountPaid.usd > 0 ? (amountPaid.usd / 100).toLocaleString("pt-BR", { style: "currency", currency: "usd" }) : ""}
    `.trim()

    aoo.push(...delegationAoo(delegation, paidString))
  })

  await Promise.all(promises);

  return aoo
}

export function delegationAoo(delegation: DelegationType, amountPaid: string) {
  const delegates = delegation?.participants?.filter((participant) => participant.delegate !== null && participant.id)
  const advisors = delegation?.participants?.filter((participant) => participant.delegationAdvisor !== null && participant.id)

  let advisorsPaid = advisors?.reduce((accumulator, delegate) => {
    if (delegate.stripePaidId) accumulator += 1
    return accumulator
  }, 0) as number

  let delegatesPaid = delegates?.reduce((accumulator, delegate) => {
    if (delegate.stripePaidId) accumulator += 1
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
      "Delegates": delegates?.length,
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
      "Waiver": participant.files?.find(file => file.name === "Liability Waiver") ? 1 : 0,
      "Amount Paid": participant.stripePaidId ? "150" : "0",
      "Status": participant.stripePaidId ? "Pago" : "Não pago",
      "Registration date": typeof participant.createdAt === "string" ? new Date(participant.createdAt).toLocaleDateString("pt-BR") : participant.createdAt.toLocaleDateString("pt-BR"),
    })
  })

  advisors?.forEach(participant => {
    aoo.push({
      "FA's": 1,
      "Full name": participant.name,
      "Waiver": participant.files?.find(file => file.name === "Liability Waiver") ? 1 : 0,
      "Amount Paid": participant.stripePaidId ? "30" : "0",
      "Status": participant.stripePaidId ? "Pago" : "Não pago",
      "Registration date": typeof participant.createdAt === "string" ? new Date(participant.createdAt).toLocaleDateString("pt-BR") : participant.createdAt.toLocaleDateString("pt-BR"),
    })
  })

  return aoo
}

export function comitteeAoo(comittee: ComitteeType) {
  const aoo: ComitteeAooType = []

  comittee.delegates.forEach(delegate => {
    aoo.push({
      "Representation": delegate.country ?? "",
      "School": delegate.user.delegation?.school,
      "Delegate": delegate.user.name,
      "Head Delegate": delegate.user.delegation?.participants[0].name,
      "Position Paper": delegate.user._count.files > 0 ? 1 : 0,
      "Male": delegate.user.sex === "Male" ? 1 : 0,
      "Female": delegate.user.sex === "Female" ? 1 : 0,
    })
  })

  return aoo
}

export type ParticipantType = Partial<
  UserType & {
    delegation: DelegationType
  }>

export function participantsAoo(participants: UserType[], type: "rg" | "cracha delegados" | "cracha orientadores") {
  const aoo: any[] = []

  switch (type) {
    case "rg":
      participants.forEach(participant => {
        aoo.push({
          "Name": participant.name,
          "Rg/Passaporte": participant.rg ?? participant.passport
        })
      })
      break;
    case "cracha delegados":
      participants.forEach(participant => {
        aoo.push({
          "Name": participant.name,
          "Committee/Council": participant.delegate?.comittee?.name,
          "Country": participant.delegate?.country,
        })
      })
      break;
    case "cracha orientadores":
      participants.forEach(participant => {
        aoo.push({
          "Name": participant.name,
          "School": participant.name,
          "Role": participant.delegationAdvisor?.advisorRole
        })
      })
      break;
    default:
      participants.forEach(participant => {
        aoo.push({
          "Name": participant.name,
          "Rg/Passaporte": participant.rg ?? participant.passport
        })
      })
      break;
  }


  return aoo
}
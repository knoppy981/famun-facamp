export default function viewDelegationData(delegation: any) {
  const participantLength = delegation.participants.length
  const hasDelegates = participantLength > 0
  const sentDocuments = delegation.participants?.reduce((accumulator: number, participant: any) => {
    if (participant.delegate) {
      if (participant.files?.filter((file: any) => file.name === "Liability Waiver" || file.name === "Position Paper").length === 2) accumulator += 1
    } else if (participant.delegationAdvisor) {
      if (participant.files?.filter((file: any) => file.name === "Liability Waiver").length === 1) accumulator += 1
    }
    return accumulator
  }, 0) as number
  const paidParticipants = delegation.participants?.reduce((accumulator: number, participant: any) => {
    if (participant.stripePaid) accumulator += 1
    return accumulator
  }, 0) as number
  const totalPaid = `${delegation.amountPaid.brl > 0 ? " " + (delegation.amountPaid.brl / 100).toLocaleString("pt-BR", { style: "currency", currency: "brl" }) : ""}${delegation.amountPaid.usd > 0 ? " " + (delegation.amountPaid.usd / 100).toLocaleString("pt-BR", { style: "currency", currency: "usd" }) : ""}`

  return [hasDelegates, participantLength, sentDocuments, paidParticipants, totalPaid]
}
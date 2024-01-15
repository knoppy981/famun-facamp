import { ActionFunctionArgs, json } from "@remix-run/node"
import { removeDelegationParticipant } from "~/models/delegation.server"

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const participantId = formData.get("participantId") as string
  const delegationId = formData.get("delegationId") as string
  let delegation
  try {
    delegation = await removeDelegationParticipant(participantId, delegationId)
  } catch (error) {
    console.log(error)
    return json(
      { errors: { deleteParticipant: "Failed deleting participant" } },
      { status: 400 }
    )
  }

  return json({ delegation })
}
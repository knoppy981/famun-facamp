import { ActionFunctionArgs, json } from "@remix-run/node"
import { updateDelegation } from "~/models/delegation.server"
import { getUserById } from "~/models/user.server"

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const participantId = formData.get("participantId") as string
  const delegationId = formData.get("delegationId") as string
  const leaderId = formData.get("leaderId") as string

  let delegation
  try {
    delegation = await updateDelegation({
      delegationId: delegationId,
      values: {
        participants: {
          updateMany: [
            {
              where: {
                id: leaderId
              },
              data: {
                leader: false
              }
            },
            {
              where: {
                id: participantId
              },
              data: {
                leader: true
              }
            }
          ]
        }
      } as any
    })
  } catch (error) {
    console.log(error)
    return json(
      { errors: { changeLeader: "Failed updating leade" } },
      { status: 400 }
    )
  }

  return json({ delegation })
}
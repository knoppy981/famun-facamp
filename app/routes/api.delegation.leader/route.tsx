import { ActionFunctionArgs, json, redirect } from "@remix-run/node"
import { updateDelegation } from "~/models/delegation.server"

import { getAdminId, getUserId } from "~/session.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await getUserId(request);
  const adminId = await getAdminId(request);

  if (!userId && !adminId) {
    const searchParams = new URLSearchParams([["redirectTo", new URL(request.url).pathname]]);
    throw redirect(`/login?${searchParams}`);
  }
  const formData = await request.formData()
  const participantId = formData.get("participantId")
  const delegationId = formData.get("delegationId")
  const leaderId = formData.get("leaderId")

  if (participantId === "undefined" || delegationId === "undefined") throw json({})

  let delegation
  try {
    delegation = await updateDelegation({
      delegationId: delegationId as string,
      values: {
        participants: {
          updateMany: [
            leaderId !== "" ? {
              where: {
                id: leaderId
              },
              data: {
                leader: false
              }
            } : undefined,
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
      { errors: { changeLeader: "Failed updating leader" } },
      { status: 400 }
    )
  }

  return json({ delegation })
}
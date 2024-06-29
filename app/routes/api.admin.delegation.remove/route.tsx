import qs, { ParsedQs } from "qs"
import { ActionFunctionArgs, json } from "@remix-run/node"
import { requireAdminId } from "~/session.server"
import { prisma } from "~/db.server";

interface ExtendedParsedQs extends ParsedQs {
  ids: string[];
  delegationId: string;
}

export const action = async ({ request }: ActionFunctionArgs) => {
  await requireAdminId(request)

  const text = await request.text()
  const { ids, delegationId, ...rest } = qs.parse(text) as ExtendedParsedQs
  console.log(ids, delegationId)
  let delegation

  try {
    delegation = await removeParticipants(delegationId, ids.map(id => ({ id: id })))
  } catch (error) {
    console.log(error)
    return json(
      { errors: { deleteParticipant: "Failed removing participant" } },
      { status: 400 }
    )
  }

  return json({ delegation })
}

async function removeParticipants(id: string, participantsIds: { id: string }[]) {
  return prisma.delegation.update({
    where: {
      id
    },
    data: {
      participants: {
        disconnect: participantsIds
      }
    }
  })
}
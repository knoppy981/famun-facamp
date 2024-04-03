import { ParticipationMethod } from "@prisma/client"
import { LoaderFunctionArgs, json } from "@remix-run/node"
import { requireAdminId } from "~/session.server"
import { getParticipantsList } from "./participantsList"
import { participantsAoo } from "./aoo"

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireAdminId(request)
  const url = new URL(request.url);
  const participationMethod = url.searchParams.get("pm") as ParticipationMethod
  const type = url.searchParams.get("type") as "rg" | "cracha delegados" | "cracha orientadores"
  let aoo: any

  try {
    if (type === null) return
    const participants = await getParticipantsList(participationMethod, type)
    if (participants === null) return
    aoo = participantsAoo(participants, type)
  } catch (error) {
    console.log(error)
    return json(
      { errors: { aoo: "Failed action" } },
      { status: 400 }
    )
  }

  return json({ aoo, type })
}
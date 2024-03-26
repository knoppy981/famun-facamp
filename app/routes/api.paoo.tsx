// participants aoo
import { ParticipationMethod } from "@prisma/client"
import { LoaderFunctionArgs, json } from "@remix-run/node"
import { getAllDelegations } from "~/models/delegation.server"
import { requireAdminId } from "~/session.server"
import { delegationsAoo } from "~/sheets/data"

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireAdminId(request)
  const url = new URL(request.url);
  const participationMethod = url.searchParams.get("pm") as ParticipationMethod
  const type = url.searchParams.get("type") as ParticipationMethod
  let aoo: any

  console.log(participationMethod, type)

  try {

  } catch (error) {
    console.log(error)
    return json(
      { errors: { aoo: "Failed action" } },
      { status: 400 }
    )
  }

  return json({ aoo })
}
// delegation aoo
import { ParticipationMethod } from "@prisma/client"
import { LoaderFunctionArgs, json } from "@remix-run/node"
import { getAllDelegations } from "~/models/delegation.server"
import { requireAdminId } from "~/session.server"
import { delegationsAoo } from "~/sheets/data"

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireAdminId(request)
  const url = new URL(request.url);
  const participationMethod = url.searchParams.get("pm") as ParticipationMethod
  let aoo: any

  try {
    const delegations = await getAllDelegations(participationMethod)
    if (delegations === undefined) return
    aoo = await delegationsAoo(delegations)
  } catch (error) {
    console.log(error)
    return json(
      { errors: { aoo: "Failed action" } },
      { status: 400 }
    )
  }

  return json({ aoo })
}
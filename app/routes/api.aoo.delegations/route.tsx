// delegation aoo
import { ParticipationMethod } from "@prisma/client"
import { LoaderFunctionArgs, json } from "@remix-run/node"
import { requireAdminId } from "~/session.server"
import { delegationsAoo } from "./aoo"
import { delegationsList } from "./delegationsList"

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireAdminId(request)
  const url = new URL(request.url);
  const participationMethod = url.searchParams.get("pm") as ParticipationMethod
  let aoo: any

  try {
    const delegations = await delegationsList(participationMethod)
    console.dir(delegations, { depth: null })
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
// delegation aoo
import { LoaderFunctionArgs, json } from "@remix-run/node"
import { listDelegates } from "~/models/delegate.server"
import { DelegationType, getAllDelegations } from "~/models/delegation.server"
import { requireAdminId } from "~/session.server"
import { delegationsAoo } from "~/sheets/data"

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireAdminId(request)
  let aoo: any


  try {
    const delegations = await getAllDelegations()
    if (delegations === undefined) return
    aoo = await delegationsAoo(delegations)
  } catch (error) {
    console.log(error)
    return json(
      { errors: { deleteComittee: "Failed searching users" } },
      { status: 400 }
    )
  }

  return json({ aoo })
}
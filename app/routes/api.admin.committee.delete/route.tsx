import { ActionFunctionArgs, json } from "@remix-run/node"
import { deleteCommittee } from "~/models/committee.server"

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const committeeId = formData.get("id") as string
  let committee = {}

  try {
    committee = await deleteCommittee(committeeId)
  } catch (error) {
    console.log(error)
    return json(
      { errors: { deleteCommittee: "Failed deleting committee" } },
      { status: 400 }
    )
  }

  return json({ committee })
}
import { ActionFunctionArgs, json } from "@remix-run/node"
import { deleteComittee } from "~/models/comittee.server"

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const comitteeId = formData.get("id") as string
  let comittee = {}

  try {
    comittee = await deleteComittee(comitteeId)
  } catch (error) {
    console.log(error)
    return json(
      { errors: { deleteComittee: "Failed deleting comittee" } },
      { status: 400 }
    )
  }

  return json({ comittee })
}
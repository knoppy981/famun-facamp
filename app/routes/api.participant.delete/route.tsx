import { ActionFunctionArgs, json, redirect } from "@remix-run/node"
import { deleteUserById } from "~/models/user.server";
import { getAdminId, getUserId, requireUserId } from "~/session.server"

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await getUserId(request);
  const adminId = await getAdminId(request)
  if (!userId && !adminId) {
    throw redirect(`/login`);
  }

  const formData = await request.formData()
  const participantId = formData.get("participantId") as string
  let user

  try {
    user = await deleteUserById(participantId)
  } catch (error) {
    console.log(error)
    return json(
      { errors: { deleteParticipant: "Failed deleting participant" } },
      { status: 400 }
    )
  }

  return json({ user })
}
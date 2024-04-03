// get participants by id
import qs from "qs"
import { LoaderFunctionArgs, json, redirect } from "@remix-run/node"
import { getAdminId, getUserId, requireUserId } from "~/session.server"
import { getManyUsersById } from "~/models/user.server"

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request);
  const adminId = await getAdminId(request)
  if (!userId && !adminId) {
    const searchParams = new URLSearchParams([["redirectTo", new URL(request.url).pathname]]);
    throw redirect(`/login?${searchParams}`);
  }
  const url = new URL(request.url);
  const participantsId = qs.parse(url.searchParams.get("ids") as string)
  let users

  try {
    if (typeof participantsId === "object") {
      users = await getManyUsersById(
        Object.values(participantsId)
          .flat()
          .filter((id): id is string => typeof id === 'string')
      )
    }
  } catch (error) {
    console.log(error)
    return json(
      { errors: { deleteCommittee: "Failed searching users" } },
      { status: 400 }
    )
  }

  return json({ users })
}
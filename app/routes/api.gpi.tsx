// get participants by id
import { ParticipationMethod } from "@prisma/client"
import qs from "qs"
import { LoaderFunctionArgs, json } from "@remix-run/node"
import { getAllDelegations } from "~/models/delegation.server"
import { requireAdminId, requireUserId } from "~/session.server"
import { delegationsAoo } from "~/sheets/data"
import { getManyUsersById } from "~/models/user.server"

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUserId(request)
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
      { errors: { deleteComittee: "Failed searching users" } },
      { status: 400 }
    )
  }

  console.log(users)

  return json({ users })
}
// delegation aoo
import { ParticipationMethod } from "@prisma/client"
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node"
import { requireAdminId } from "~/session.server"
import { prisma } from "~/db.server"
import { credentialsAoa } from "./utils/aoa"

export const action = async ({ request }: ActionFunctionArgs) => {
  await requireAdminId(request)
  const formData = await request.formData()
  const participationMethod = formData.get("pm") as ParticipationMethod
  let aoa: any

  try {
    const list = await dailyCheckInList(participationMethod)
    aoa = credentialsAoa(list)
  } catch (error) {
    console.log(error)
    return json(
      { errors: { aoo: "Failed action" } },
      { status: 400 }
    )
  }

  return json({ aoa })
}

async function dailyCheckInList(participationMethod: ParticipationMethod) {
  return prisma.user.findMany({
    where: { participationMethod },
    select: {
      name: true,
      presenceControl: {
        select: {
          dailyCheckIn: true
        }
      }
    }
  })
}


// delegation aoo
import { ParticipationMethod } from "@prisma/client"
import { LoaderFunctionArgs, json } from "@remix-run/node"
import { requireAdminId } from "~/session.server"
import { delegationsAoo } from "./utils/aoo"
import { prisma } from "~/db.server"

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireAdminId(request)
  const url = new URL(request.url);
  const participationMethod = url.searchParams.get("pm") as ParticipationMethod
  let aoo: any

  try {
    const delegations = await delegationsList(participationMethod)
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

async function delegationsList(pm: ParticipationMethod): Promise<any[]> {
  const currentYear = new Date().getFullYear();
  const startDate = new Date(currentYear, 0, 1);
  const endDate = new Date(currentYear + 1, 0, 1);

  return prisma.delegation.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lt: endDate
      },
      participationMethod: pm
    },
    include: {
      address: true,
      participants: {
        include: {
          delegate: true,
          delegationAdvisor: true,
          files: {
            select: {
              fileName: true,
              name: true,
            }
          }
        },
      }
    }
  })
}
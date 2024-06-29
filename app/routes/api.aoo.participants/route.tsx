import { ParticipationMethod } from "@prisma/client"
import { LoaderFunctionArgs, json } from "@remix-run/node"
import { requireAdminId } from "~/session.server"
import { participantsAoo } from "./utils/aoo"
import { prisma } from "~/db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireAdminId(request)
  const url = new URL(request.url);
  const participationMethod = url.searchParams.get("pm") as ParticipationMethod
  const type = url.searchParams.get("type") as "rg" | "cracha delegados" | "cracha orientadores"
  let aoo: any

  try {
    if (type === null) return
    const participants = await getParticipantsList(participationMethod, type)
    if (participants === null) return
    aoo = participantsAoo(participants, type)
  } catch (error) {
    console.log(error)
    return json(
      { errors: { aoo: "Failed action" } },
      { status: 400 }
    )
  }

  return json({ aoo, type })
}

async function getParticipantsList(participationMethod: ParticipationMethod, type: "rg" | "cracha delegados" | "cracha orientadores") {
  console.log(participationMethod, type)
  let query
  let select

  switch (type) {
    case "rg":
      select = {
        name: true,
        rg: true,
        passport: true
      }
      query = {
        participationMethod,
        delegate: {
          isNot: null
        }
      }
      break
    case "cracha delegados":
      select = {
        name: true,
        delegate: {
          select: {
            committee: {
              select: {
                name: true,
              }
            },
            country: true
          }
        }
      }
      query = {
        participationMethod,
        delegate: {
          isNot: null
        }
      }
      break
    case "cracha orientadores":
      select = {
        name: true,
        delegation: {
          select: {
            school: true
          }
        }
      }
      query = {
        participationMethod,
        delegationAdvisor: {
          isNot: null
        }
      }
      break
  }

  if (select === undefined || query === null) return null

  return prisma.user.findMany({
    where: query,
    select
  })

}
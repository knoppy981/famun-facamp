import { ParticipationMethod } from "@prisma/client";
import { prisma } from "~/db.server";

export async function getParticipantsList(participationMethod: ParticipationMethod, type: "rg" | "cracha delegados" | "cracha orientadores") {
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
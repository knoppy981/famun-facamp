import { ParticipationMethod } from "@prisma/client";
import { prisma } from "~/db.server";

export async function delegationsList(pm: ParticipationMethod): Promise<any[]> {
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
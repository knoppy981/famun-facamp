import { ParticipationMethod } from "@prisma/client";
import { prisma } from "~/db.server";
import { ValidationError } from "~/utils/error";

export async function getCommitteeByName(name: string) {
  const currentYear = new Date().getFullYear();
  const startDate = new Date(currentYear, 0, 1);
  const endDate = new Date(currentYear + 1, 0, 1);

  return prisma.committee.findFirst({
    where: {
      name,
      createdAt: {
        gte: startDate,
        lt: endDate
      },
    },
    include: {
      delegates: {
        select: {
          id: true,
          country: true,
          user: {
            select: {
              name: true,
              sex: true,
              _count: {
                select: {
                  files: {
                    where: {
                      name: "Position Paper"
                    }
                  }
                }
              },
              delegation: {
                select: {
                  school: true,
                  participants: {
                    where: {
                      leader: true
                    },
                    select: {
                      name: true
                    }
                  }
                }
              }
            }
          }
        },
        orderBy: {
          country: "asc"
        }
      }
    }
  })
}

export async function getCommitteesList(participationMethod: ParticipationMethod, searchQuery?: string) {
  const currentYear = new Date().getFullYear();
  const startDate = new Date(currentYear, 0, 1);
  const endDate = new Date(currentYear + 1, 0, 1);

  return prisma.committee.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lt: endDate
      },
      type: participationMethod,
      name: searchQuery ? {
        contains: searchQuery,
        mode: "insensitive"
      } : undefined
    },
    include: {
      _count: {
        select: {
          delegates: true
        }
      }
    }
  })
}

export async function getExistingCommittee(name: string) {
	let committee

	try {
		committee = await prisma.committee.findFirstOrThrow({
			where: {
				name
			}
		})
	} catch (e) {
		return {}
	}

	const errorDetails = [
		{
			message: "Nome já está sendo utilizado",
			path: ["name"],
			context: { label: "name", value: '', key: "name" }
		}
	];

	throw new ValidationError("Nome já está sendo utilizado", errorDetails)
}

export async function createCommittee({ name, council, type }: { name: string, council: string, type: ParticipationMethod }) {
  return prisma.committee.create({
    data: {
      name,
      council,
      type,
    }
  })
}

export async function deleteCommittee(id: string) {
  return prisma.committee.delete({
    where: {
      id
    }
  })
}

export async function addDelegatesToCommittee(id: string, delegatesIds: { id: string }[]) {
  return prisma.committee.update({
    where: {
      id
    },
    data: {
      delegates: {
        connect: delegatesIds
      }
    }
  })
}

export async function removeDelegates(id: string, delegatesIds: { id: string }[]) {
  return prisma.committee.update({
    where: {
      id
    },
    data: {
      delegates: {
        disconnect: delegatesIds
      }
    }
  })
}
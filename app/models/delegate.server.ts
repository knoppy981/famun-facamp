import { prisma } from "~/db.server";

export async function listDelegates(query?: string) {
  return prisma.delegate.findMany({
    where: {
      user: {
        name: query ? {
          contains: query,
          mode: "insensitive"
        } : undefined,
      },
      Committee: {
        is: null
      }
    },
    select: {
      id: true,
      user: {
        select: {
          name: true
        }
      }
    }
  })
}

export async function changeDelegateRepresentation(id: string, country: string) {
  return prisma.delegate.update({
    where: {
      id
    },
    data: {
      country
    }
  })
}

export async function removeFromComittee(delegateId: string) {
  return prisma.delegate.update({
    where: {
      id: delegateId
    },
    data: {
      Committee: {
        disconnect: true
      }
    }
  })
}
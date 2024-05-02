import { ParticipationMethod } from "@prisma/client";
import { prisma } from "~/db.server";

export async function listDelegates(participationMethod: ParticipationMethod) {
  return prisma.delegate.findMany({
    where: {
      committee: {
        is: null
      },
      user: {
        participationMethod,
        stripePaid: {
          isSet: true
        }
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

export async function removeFromCommittee(delegateId: string) {
  return prisma.delegate.update({
    where: {
      id: delegateId
    },
    data: {
      committee: {
        disconnect: true
      }
    }
  })
}
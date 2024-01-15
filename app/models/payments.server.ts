import { prisma } from '~/db.server';
import { getUserType } from '~/models/user.server';
import { requireUser } from '~/session.server';

import type { UserType } from '~/models/user.server';

export async function getPaidUsersIds(paidUsersIds: UserType["id"][]) {
  const arr: Array<any> = []
  paidUsersIds.forEach(el => {
    arr.push({ id: el })
  })

  return prisma.user.findMany({
    where: {
      OR: arr
    },
    select: {
      name: true,
      email: true,
      delegate: true,
      delegationAdvisor: true
    }
  })
}

export async function updateUsersPaymentStatus({
  paidUsersIds,
  stripePaymentId
}: {
  paidUsersIds: Array<string>; stripePaymentId: string
}) {
  const arr: Array<any> = []
  paidUsersIds.forEach(el => {
    arr.push({ id: el })
  })

  return prisma.user.updateMany({
    where: {
      OR: arr
    },
    data: {
      stripePaydId: stripePaymentId
    }
  })
}

export async function updateUserPayments({
  userId,
  stripePaymentId
}: {
  userId: UserType["id"]; stripePaymentId: string
}) {
  return prisma.user.update({
    where: {
      id: userId
    },
    data: {
      stripePaymentsId: {
        push: stripePaymentId
      }
    }
  })
}

export async function getUserPaymentsIds(userId: UserType["id"]) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      stripePaymentsId: true
    }
  })

  return user?.stripePaymentsId
}

export async function getRequiredPayments({
  userId,
  isLeader,
  delegationId
}: {
  userId: UserType["id"],
  isLeader: UserType["leader"]
  delegationId: UserType["delegationId"]
}) {
  const userType = await getUserType(userId)

  if (!delegationId) return undefined

  const delegation = await prisma.delegation.findUnique({
    where: {
      id: delegationId
    },
    select: {
      paymentExpirationDate: true,
      participants: {
        where: {
          OR: [
            { stripePaydId: { isSet: false } },
            { stripePaydId: { equals: "" } }
          ]
        },
        select: {
          id: true,
          name: true,
          nacionality: true,
          delegate: true,
        },
        orderBy: {
          delegationAdvisor: { id: "asc" }
        },
      }
    }
  })
  const payments: Array<{
    id: UserType["id"],
    name: UserType["name"],
    price: number,
    currency: string,
    type: "delegate" | "advisor",
    available: boolean,
    expiresAt: Date,
    expired: boolean,
  }> = []

  if (delegation === null) {
    throw new Error('delegation not found');
  }

  delegation.participants?.forEach(participant => {
    payments.push({
      id: participant.id,
      name: participant.name,
      price: participant.delegate ? 10000 : 3000,
      currency: participant.nacionality !== "Brazil" ? "USD" : "BRL",
      type: participant.delegate ? "delegate" : "advisor",
      available: isLeader || userType === 'advisor' ? true : userId === participant.id,
      expiresAt: delegation.paymentExpirationDate,
      expired: new Date() > delegation.paymentExpirationDate
    })
  })

  return payments
}
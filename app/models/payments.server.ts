import { prisma } from '~/db.server';
import { getUserType } from '~/models/user.server';
import { requireUser } from '~/session.server';

import type { UserType } from '~/models/user.server';
import { getPaymentPrices } from './configuration.server';
import { Languages, ParticipationMethod } from '@prisma/client';

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
      stripePaidId: stripePaymentId
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
            { stripePaidId: { isSet: false } },
            { stripePaidId: { equals: "" } }
          ]
        },
        select: {
          id: true,
          name: true,
          nacionality: true,
          delegate: true,
          participationMethod: true,
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

  const prices = await getPaymentPrices()

  if (delegation === null || prices === null) {
    throw new Error('delegation not found');
  }

  delegation.participants?.forEach(participant => {
    let price
    if (participant.delegate) {
      if (participant.nacionality === "Brazil") {
        if (participant.participationMethod === "Escola") {
          price = prices.precoDelegadoEnsinoMedio
        } else {
          price = prices.precoDelegadoUniversidade
        }
      } else {
        price = prices.precoDelegadoInternacional
      }
    } else {
      if (participant.nacionality === "Brazil") {
        price = prices.precoProfessorOrientador
      } else {
        price = prices.precoFacultyAdvisors
      }
    }

    payments.push({
      id: participant.id,
      name: participant.name,
      price: price,
      currency: participant.nacionality !== "Brazil" ? "usd" : "brl",
      type: participant.delegate ? "delegate" : "advisor",
      available: isLeader || userType === 'advisor' ? true : userId === participant.id,
      expiresAt: delegation.paymentExpirationDate,
      expired: new Date() > delegation.paymentExpirationDate
    })
  })

  return payments
}
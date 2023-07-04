import { prisma } from '~/db.server';
import { getUserType } from '~/models/user.server';
import { requireUser } from '~/session.server';

export async function updateUsersPaymentStatus({ paidUsersIds, stripePaymentId }) {
  const arr = []
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

export async function updateUserPayments({ userId, stripePaymentId }) {
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

export async function getUserPaymentsIds(userId) {
  return prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      stripePaymentsId: true
    }
  })
}

export async function getRequiredPayments({ user, delegationId }) {
  const userType = await getUserType(user.id)

  if (!delegationId) return undefined

  const delegation = await prisma.delegation.findUnique({
    where: {
      id: delegationId
    },
    select: {
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
          delegationAdvisor: {id: "asc"}
        },
      }
    }
  })
  const payments = []

  delegation.participants?.forEach(participant => {
    payments.push({
      id: participant.id,
      name: participant.name,
      price: participant.delegate ? 10000 : 3000,
      type: participant.delegate ? "delegate" : "advisor",
      available: user.leader || userType === 'advisor' ? true : user.id === participant.id
    })
  })

  return payments

}
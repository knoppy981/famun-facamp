import { prisma } from '~/db.server';
import { getUserType } from '~/models/user.server';

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
      stripePaymentId: stripePaymentId
    }
  })
}

export async function updateDelegationPaymentStatus({ delegationId, stripePaymentId }) {
  return prisma.delegation.update({
    where: {
      id: delegationId
    },
    data: {
      stripePaymentId: stripePaymentId
    }
  })

}

export async function getRequiredPayments({ userId, delegationId }) {
  const userType = await getUserType(userId)

  if(!delegationId) return undefined
  
  const delegation = await prisma.delegation.findUnique({
    where: {
      id: delegationId
    },
    select: {
      stripePaymentId: true,
      participants: {
        where: {
          stripePaymentId: {
            isSet: false
          }
        },
        select: {
          id: true,
          name: true
        }
      }
    }
  })
  const payments = []

  if (!delegation.stripePaymentId) {
    payments.push({ 
      type: "delegation", 
      id: delegationId, 
      price: 6000, 
      available: userType !== 'delegate' 
    })
  }
  delegation.participants?.forEach(participant => {
    payments.push({ 
      type: "user", 
      id: participant.id, 
      name: participant.name, 
      price: 4500, 
      available: userType === 'delegate' ? userId === participant.id : true 
    })
  })

  return payments

}
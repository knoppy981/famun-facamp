import { prisma } from "~/db.server";

export async function getUserPayments(userId) {
  if (!userId) return undefined
  return prisma.payment.findMany({
    where: {
      clientId: userId
    }
  })
}
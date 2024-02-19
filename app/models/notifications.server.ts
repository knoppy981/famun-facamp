import { prisma } from "~/db.server";

export async function createUserChangeNotification(userId: string, data: string, targetId: string, description?: string) {
  return prisma.notifications.create({
    data: {
      data,
      type: "user",
      description,
      targetUser: {
        connect: {
          id: targetId
        }
      },
      user: {
        connect: {
          id: userId
        }
      }
    }
  })
}

export async function createDelegationChangeNotification(userId: string, data: string, targetId: string, description?: string) {
  return prisma.notifications.create({
    data: {
      data,
      type: "delegation",
      description,
      targetDelegation: {
        connect: {
          id: targetId
        }
      },
      user: {
        connect: {
          id: userId
        }
      }
    }
  })
}
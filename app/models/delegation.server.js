import { prisma } from "~/db.server";

export async function getDelegationByUserId(id) {
	const data = await prisma.user.findUnique({
		where: {
			id: id,
		},
		select: {
			delegation: true
		}
	})
	return data.delegation
}

export async function joinDelegation(userId, delegationId) {
  return prisma.user.update({
		where: {
			id: userId
		},
		data: {
			delegation: {
				connect: {
					id: delegationId
				}
			}
		}
	})
}
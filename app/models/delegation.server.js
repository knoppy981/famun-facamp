import { prisma } from "~/db.server";

export async function getDelegationById(id) {
	return prisma.delegation.findUnique({
		where: {
			id: id,
		},
		include: {
			users: true,
		}
	})
}

export async function findDelegationCode(code) {
	return prisma.delegation.findFirst({
		where: {
			code: code
		},
		select: {
			id: true
		}
	})
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

export async function updateDelegationCode(delegationId, code) {
	return prisma.delegation.update({
		where: {
			id: delegationId,
		},
		data: {
			code: code
		}
	})
}

export async function createDelegation() {
	
}
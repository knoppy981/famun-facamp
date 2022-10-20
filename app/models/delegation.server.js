import { prisma } from "~/db.server";
import jwt from "jsonwebtoken";

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

export async function joinDelegationWithCode(userId, delegationCode) {
	return prisma.user.update({
		where: {
			id: userId
		},
		data: {
			delegation: {
				connect: {
					code: delegationCode
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

export async function generateDelegationInviteLink(delegationCode) {
	const { JSON_WEB_TOKEN_SECRET } = process.env;

	const token = jwt.sign(
		{ delegationCode: delegationCode },
		JSON_WEB_TOKEN_SECRET,
		{ expiresIn: 60 }
	);

	return `http://localhost:3000/auth/${token}`

}
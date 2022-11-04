import { prisma } from "~/db.server";
import jwt from "jsonwebtoken";

export async function getDelegationById(id) {
	return prisma.delegation.findUnique({
		where: {
			id: id,
		},
		select: {
			school: true,
			code: true,
			participationMethod: true,
			createdAt: true,
			delegate: {
				select: {
					createdAt: true,
					user: {
						select: {
							id: true,
							name: true,
						}
					}
				}
			},
			delegationAdvisor: {
				select: {
					createdAt: true,
					advisorRole: true,
					user: {
						select: {
							id: true,
							name: true,
						}
					}
				}
			},
			delegationLeader: {
				select: {
					id: true,
					name: true
				}
			}
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
	const delegation = findDelegationCode(delegationCode)

	/* achar lider da delegacao e mandar no link tambem */
	/* checar se ja estorou maximo de participantes */

	/* const delegation = await findDelegationCode(delegationCode) */
	/* console.log(delegation) */

	const token = jwt.sign(
		{ delegationCode: delegationCode },
		JSON_WEB_TOKEN_SECRET,
		{ expiresIn: 60 * 60 }
	);

	return `http://localhost:3000/linkInvitation/${token}`
}

export async function decodeInviteLink(token) {
	const { JSON_WEB_TOKEN_SECRET } = process.env;

	try {
		return jwt.verify(token, JSON_WEB_TOKEN_SECRET, { complete: true })
	} catch (err) {
		return {err}
	}
}
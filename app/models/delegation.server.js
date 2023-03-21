import { prisma } from "~/db.server";
import { Prisma } from '@prisma/client'
import jwt from "jsonwebtoken";
import { updateUser } from "./user.server";

export async function getDelegationById(id) {
	return prisma.delegation.findUnique({
		where: {
			id: id,
		},
		include: {
			address: true,
			participants: {
				include: {
					delegate: true,
					delegationAdvisor: true,
				}
			}
		}
	})
}

export async function getDelegationByCode(code) {
	return prisma.delegation.findFirst({
		where: {
			code: code
		},
	})
}

export async function joinDelegation(data) {
	return prisma.delegation.update({
		where: {
			code: data.code
		},
		data: {
			participants: {
				connect: [
					{ id: data.userId }
				]
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
	}).catch(async (err) => {
		if (err instanceof Prisma.PrismaClientKnownRequestError) throw (err)
	})
}

export async function createDelegation(data) {

	await updateUser({ userId: data.userId, values: { leader: true } })

	return prisma.delegation.create({
		data: {
			code: data.code,
			inviteLink: data.inviteLink,
			participationMethod: data.participationMethod,
			school: data.schoolName,
			schoolPhoneNumber: data.schoolPhoneNumber,
			address: {
				create: {
					address: data.address,
					cep: data.cep,
					city: data.city,
					country: data.country,
					neighborhood: data.neighborhood,
					state: data.state,
				}
			},
			participants: {
				connect: {
					id: data.userId
				}
			}
		}
	})
}

export async function generateDelegationInviteLink(delegationCode) {
	const { JSON_WEB_TOKEN_SECRET, WEBSITE_URL } = process.env;

	/* achar lider da delegacao e mandar no link tambem */
	/* checar se ja estorou maximo de participantes */

	/* const delegation = await findDelegationCode(delegationCode) */
	/* console.log(delegation) */

	const token = jwt.sign(
		{ delegationCode: delegationCode },
		JSON_WEB_TOKEN_SECRET,
		{ expiresIn: 60 * 60 * 24 * 30 }
	);

	return `${WEBSITE_URL}/i/${token}`
}

export async function decodeInviteLink(token) {
	const { JSON_WEB_TOKEN_SECRET } = process.env;

	try {
		return jwt.verify(token, JSON_WEB_TOKEN_SECRET, { complete: true })
	} catch (err) {
		return { err }
	}
}

export async function updateInviteLink(delegationCode) {
	const link = await generateDelegationInviteLink(delegationCode)

	return prisma.delegation.update({
		where: {
			code: delegationCode
		},
		data: {
			inviteLink: link
		}
	})
}
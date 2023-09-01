import { prisma } from "~/db.server";
import { Prisma } from '@prisma/client'
import jwt from "jsonwebtoken";
import { formatUserData, updateUser } from "./user.server";
import { ValidationError } from "~/utils";

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

export async function joinDelegationById(delegationId, userId) {
	return prisma.delegation.update({
		where: {
			id: delegationId
		},
		data: {
			participants: {
				connect: [
					{ id: userId }
				]
			}
		}
	})
}

export async function updateDelegation({ delegationId, values }) {
	return prisma.delegation.update({
		where: {
			id: delegationId
		},
		data: values,
		include: {
			address: true,
			participants: {
				include: {
					delegate: true,
					delegationAdvisor: true
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
	}).catch(async (err) => {
		if (err instanceof Prisma.PrismaClientKnownRequestError) throw (err)
	})
}

export async function getExistingDelegation({ delegationId, ...values }) {
	const checkableValues = Object.entries(values).map(entry => {
		return { [entry[0]]: entry[1] };
	})

	let delegation

	try {
		delegation = await prisma.delegation.findFirstOrThrow({
			where: {
				OR: checkableValues,
				NOT: { id: delegationId }
			}
		})
	} catch (e) {
		return {}
	}

	let field
	let errorMsg

	if (values.school === delegation.school) {
		field = "school"
		errorMsg = "Name already taken"
	}

	const errorDetails = [
		{
			message: errorMsg,
			path: [field],
			context: { label: field, value: '', key: field }
		}
	];

	throw new ValidationError(errorMsg, errorDetails)
}

export async function formatDelegationData({
	data,
	addressModification,
	participantModification,
	usersIdFilter
}) {
	let address
	let participants

	// handle address
	if (typeof data.address === "object") {
		delete data.address.id
		delete data.address.delegationId
		address = { [addressModification]: data.address }
	} else {
		delegate = {
			[addressModification]: {
				address: data.address,
				postalCode: data.postalCode,
				city: data.city,
				country: data.country,
				neighborhood: data.neighborhood,
				state: data.state,
			}
		}
	}

	// handle participants
	if (data?.participants.length > 0 && usersIdFilter.length > 0) {
		if (participantModification === "updateMany") {
			let aux = await Promise.all(data.participants
				.filter(participant => usersIdFilter.includes(participant.id))
				.map(async participant => {
					return {
						where: { id: participant.id },
						data: await formatUserData({
							data: participant,
							childrenModification: "update",
							userType: participant.delegate ? "delegate" : "advisor"
						})
					}
				})
			)
			participants = {
				[participantModification]: aux
			}
		} else if (participantModification === "update" && usersIdFilter.length === 1) {
			let aux = data.participants.find(participant => participant.id === usersIdFilter[0])
			participants = {
				[participantModification]: {
					where: { id: aux.id },
					data: await formatUserData({
						data: aux,
						childrenModification: "update",
						userType: aux.delegate ? "delegate" : "advisor"
					}),
				}
			}
		}
	} else {
		participants = undefined
	}

	return {
		code: data.code,
		inviteLink: await generateDelegationInviteLink(data.code),
		participationMethod: data.participationMethod,
		school: data.school,
		schoolPhoneNumber: data.schoolPhoneNumber,
		address,
		participants,
	}
}

export async function createDelegation(data, userId) {
	const delegation = await prisma.delegation.create({ data: data })

	await updateUser({ userId: userId, values: { leader: true } })

	return delegation
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
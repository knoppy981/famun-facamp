import { prisma } from "~/db.server";
import jwt from "jsonwebtoken";

import { UserType, formatUserData, updateUser } from "./user.server";
import { ValidationError } from "~/utils/error";

import { Prisma, type Delegation, DelegationPayload, UserPayload, User, Delegate, DelegationAdvisor, Address, ParticipationMethod } from "@prisma/client";
export type { Delegation } from "@prisma/client";

export type DelegationType = Delegation & {
	address?: Address,
	participants?: UserType[]
}

export async function getDelegationById(id: Delegation["id"]) {
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
					foodRestrictions: true,
				}
			},
			_count: {
				select: {
					participants: {
						where: {
							delegate: {
								NOT: {
									id: undefined
								}
							}
						}
					}
				}
			}
		}
	})
}

export async function getDelegationByCode(code: Delegation["code"]) {
	return prisma.delegation.findFirst({
		where: {
			code: code
		},
		include: {
			_count: {
				select: {
					participants: {
						where: {
							delegate: {
								NOT: {
									id: undefined
								}
							}
						}
					}
				}
			}
		}
	})
}

export async function countDelegates(id: Delegation["id"]): Promise<number> {
	const res = await prisma.delegation.findUnique({
		where: {
			id: id,
		},
		select: {
			_count: {
				select: {
					participants: {
						where: {
							delegate: {
								NOT: {
									id: undefined
								}
							}
						}
					}
				}
			}
		},
	});

	return res?._count.participants as number
}

export async function adminDelegationsList(index: number, participationMethod: ParticipationMethod) {
	return prisma.delegation.findMany({
		skip: index * 12,
		take: 12,
		where: {
			participationMethod: participationMethod
		},
		select: {
			id: true,
			school: true,
			participants: {
				select: {
					name: true,
					delegate: true,
					delegationAdvisor: true,
					_count: {
						select: {
							files: {
								where: {
									OR: [
										{ name: "Liability Waiver" },
										{ name: "Position Paper" }
									]
								}
							}
						}
					}
				}
			},
			_count: {
				select: {
					participants: {
						where: {
							stripePaydId: {
								not: null
							}
						}
					}
				}
			}
		}
	})
}

export async function adminDelegationData(delegationId: Delegation["id"]) {
	return prisma.delegation.findUnique({
		where: {
			id: delegationId,
		},
		include: {
			address: true,
			participants: {
				include: {
					delegate: true,
					delegationAdvisor: true,
					foodRestrictions: true,
					files: {
						select: {
							name: true,
							size: true,
							createdAt: true,
							fileName: true,
						}
					}
				}
			},
		}
	})
}

export async function joinDelegation(data: { code: string; userId: string }) {
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

export async function joinDelegationById(delegationId: Delegation["id"], userId: User["id"]) {
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

export async function removeDelegationParticipant(participantId: User["id"], delegationId: Delegation["id"]) {
	const delegation = await prisma.delegation.update({
		where: {
			id: delegationId
		},
		data: {
			participants: {
				delete: {
					id: participantId
				}
			}
		},
		include: {
			address: true,
			participants: {
				include: {
					delegate: true,
					delegationAdvisor: true,
					foodRestrictions: true,
				}
			}
		}
	})

	return delegation
}

export async function updateDelegation({
	delegationId,
	values
}: {
	delegationId: Delegation["id"],
	values: Delegation
}) {
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
					delegationAdvisor: true,
					foodRestrictions: true,
				}
			}
		}
	})
}

export async function updateDelegationCode(delegationId: Delegation["id"], code: Delegation["code"]) {
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

export async function getExistingDelegation({
	delegationId,
	...values
}: {
	delegationId?: Delegation["id"],
	[key: string]: any;
}) {
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

	let field = ""
	let errorMsg = ""

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

type UserWithDelegateAndAdvisor = User & {
	delegate: Delegate | null
	delegationAdvisor: DelegationAdvisor | null
}

export async function formatDelegationData({
	data,
	addressModification,
	participantModification,
	usersIdFilter
}: {
	data: any;
	addressModification: string;
	participantModification: string;
	usersIdFilter?: Array<any>
}) {
	let address
	let participants

	// handle address
	if (typeof data.address === "object") {
		delete data.address.id
		delete data.address.delegationId
		address = { [addressModification]: data.address }
	} else {
		address = {
			[addressModification]: {
				address: data.address,
				postalCode: data.postalCode,
				city: data.city,
				country: data.country,
				state: data.state,
			}
		}
	}

	// handle participants
	if (data?.participants?.length > 0 && usersIdFilter && usersIdFilter.length > 0) {
		if (participantModification === "updateMany") {
			// check
			let aux = await Promise.all(data.participants
				.filter((participant: User) => usersIdFilter.includes(participant.id))
				.map(async (participant: UserWithDelegateAndAdvisor) => {
					return {
						where: { id: participant.id },
						data: await formatUserData({
							data: participant,
							childrenModification: "update",
							userType: participant.delegate ? "delegate" : "advisor",
							participationMethod: participant.participationMethod
						})
					}
				})
			)
			participants = {
				[participantModification]: aux
			}
		} else if (participantModification === "update" && usersIdFilter.length === 1) {
			// check
			let aux = data.participants.find((participant: UserWithDelegateAndAdvisor) => participant.id === usersIdFilter[0])
			participants = {
				[participantModification]: {
					where: { id: aux.id },
					data: await formatUserData({
						data: aux,
						childrenModification: "update",
						userType: aux.delegate ? "delegate" : "advisor",
						participationMethod: aux.participationMethod
					}),
				}
			}
		}
	} else if (participantModification === "connect" && data.user) {
		//works
		participants = {
			[participantModification]: {
				id: data.user.id,
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
		paymentExpirationDate: data.paymentExpirationDate,
		address,
		participants,
	}
}

export async function createDelegation(data: any, userId: User["id"]) {
	const delegation = await prisma.delegation.create({ data: data })

	await updateUser({ userId: userId, values: { leader: true } })

	return delegation
}

export async function generateDelegationInviteLink(delegationCode: Delegation["code"]) {
	const { JSON_WEB_TOKEN_SECRET, WEBSITE_URL } = process.env;

	const token = jwt.sign(
		{ delegationCode: delegationCode },
		JSON_WEB_TOKEN_SECRET as jwt.Secret,
		{ expiresIn: 60 * 60 * 24 * 30 }
	);

	return `${WEBSITE_URL}/i/${token}`
}

export async function updateInviteLink(delegationCode: Delegation["code"]) {
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
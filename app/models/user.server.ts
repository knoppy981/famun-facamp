import bcrypt from "bcryptjs";
import qs from "qs"
import { prisma } from "~/db.server";

import { ValidationError } from "~/utils/error";
import { stripe } from "~/stripe.server";

import type { Password, User, Delegate, DelegationAdvisor, File, FoodRestrictions, ParticipationMethod, Committee } from "@prisma/client";

export type UserType = User & {
	delegate?: Delegate & {
		committee?: Committee
	},
	delegationAdvisor?: DelegationAdvisor,
	files?: Partial<File>[],
	foodRestrictions?: FoodRestrictions
}

export async function getUserById(id: User["id"]) {
	return prisma.user.findUnique({
		where: { id },
		include: {
			delegate: {
				include: {
					committee: true
				}
			},
			delegationAdvisor: true,
			files: {
				select: {
					fileName: true,
					name: true,
					size: true,
				}
			},
			foodRestrictions: true
		}
	});
}

export async function getManyUsersById(ids: (string)[]) {
	return prisma.user.findMany({
		where: {
			id: {
				in: ids
			}
		},
		select: {
			name: true,
			socialName: true,
			stripePaid: true
		}
	})
}

export async function getUserByEmail(email: User["email"]) {
	return prisma.user.findUnique({
		where: { email },
		include: {
			delegate: true,
			delegationAdvisor: true,
			files: {
				select: {
					fileName: true,
					name: true,
					size: true,
				}
			},
			foodRestrictions: true
		}
	});
}

export async function getUserByCustomerId(stripeCustomerId: User["stripeCustomerId"]) {
	return prisma.user.findFirst({
		where: {
			stripeCustomerId
		},
		include: {
			delegate: true,
			delegationAdvisor: true,
			files: {
				select: {
					fileName: true,
					name: true,
					size: true,
				}
			},
			foodRestrictions: true
		}
	});
}

export async function getExistingUser({ userId, ...values }: { userId?: User["id"];[key: string]: any }) {
	console.log("checking existing user")
	const checkableValues = Object.entries(values).map(entry => {
		return { [entry[0]]: entry[1] };
	})

	let user

	try {
		user = await prisma.user.findFirstOrThrow({
			where: {
				OR: checkableValues,
				NOT: { id: userId }
			}
		})
	} catch (e) {
		return {}
	}

	let field = ""
	let errorMsg = ""

	if (values.email === user.email) {
		field = "email"
		errorMsg = "Este e-mail já está sendo usado"
	} else if (values.name === user.name) {
		field = "name"
		errorMsg = "Este nome já está sendo usado"
	} else if (values.cpf === user.cpf) {
		field = "cpf"
		errorMsg = "Este CPF já está sendo usado"
	} else if (values.rg === user.rg) {
		field = "rg"
		errorMsg = "Este RG já está sendo usado"
	} else if (values.passport === user.passport) {
		field = "passport"
		errorMsg = "Este passporte já está sendo usado"
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

export async function adminParticipantList(index: number, participationMethod: ParticipationMethod, orderBy: string, searchQuery?: string) {
	let orderByObject
	type orderByType = "asc" | "desc"
	switch (orderBy) {
		case "user":
			orderByObject = { name: "asc" as orderByType }
			break;
		case "delegation":
			orderByObject = { delegation: { school: "asc" as orderByType } }
			break;
		case "createdAt":
			orderByObject = { createdAt: "asc" as orderByType }
			break;
		case "position":
			orderByObject = { delegate: { user: { name: "asc" as orderByType } } }
			break;
		default:
			orderByObject = { name: "asc" as orderByType }
			break;
	}

	const where: any = {
		participationMethod: participationMethod,
	}

	if (searchQuery) where.OR = [
		{
			name: searchQuery ? {
				contains: searchQuery,
				mode: "insensitive"
			} : undefined
		},
		{
			email: searchQuery ? {
				contains: searchQuery,
				mode: "insensitive"
			} : undefined
		}
	]

	return prisma.user.findMany({
		skip: index * 12,
		take: 12,
		where,
		include: {
			delegate: {
				include: {
					committee: true
				}
			},
			delegationAdvisor: true,
			foodRestrictions: true,
			notifications: {
				orderBy: {
					createdAt: "desc"
				}
			},
			files: {
				select: {
					id: true,
					name: true,
					size: true,
					createdAt: true,
					fileName: true,
				}
			},
			delegation: {
				select: {
					school: true
				}
			}
		},
		orderBy: orderByObject,
	})
}

export async function updateUser({
	email,
	userId,
	values
}: {
	email?: User["email"] | undefined; userId?: User["id"] | undefined;[key: string]: string | any
}) {
	return prisma.user.update({
		where: {
			id: userId,
			email: email,
		},
		data: values,
		include: {
			delegate: true,
			delegationAdvisor: true,
			foodRestrictions: true,
		}
	})
}

export async function formatUserData({
	data,
	userType,
	participationMethod
}: {
	data: any;
	userType: string,
	participationMethod: string
}) {
	let delegate
	let delegationAdvisor
	let foodRestrictions

	if (userType === "delegate") {
		delegate = {
			create: {
				councilPreference: Object.values(qs.parse(data?.councilPreference)),
				languagesSimulates: data?.languagesSimulates,
				emergencyContactName: data.emergencyContactName,
				emergencyContactPhoneNumber: data.emergencyContactPhoneNumber,
				educationLevel: data.educationLevel,
				currentYear: data.currentYear.trim(),
			}
		}
	} else {
		delegationAdvisor = {
			create: {
				advisorRole: data?.advisorRole?.slice(data?.advisorRole.length - 3) === "(a)" ? data?.advisorRole.slice(0, -3) : data?.advisorRole,
				facebook: data.facebook ?? undefined,
				instagram: data.instagram ?? undefined,
				linkedin: data.linkedin ?? undefined,
			}
		}
	}

	if (data.diet || data.allergy) {
		foodRestrictions = {
			create: {
				diet: data.diet,
				allergy: data.allergy === "on" ? true : false,
				allergyDescription: data.allergy === "on" ? data.allergyDescription.trim() : undefined
			}
		}
	}

	return {
		email: data.email,
		name: data.name.trim(),
		socialName: data.socialName ? data.socialName.trim() : null,
		password: data.password ? {
			create: {
				hash: await bcrypt.hash(data.password, 10)
			}
		} : undefined,
		cpf: data.cpf ? data.cpf.trim() : null,
		rg: data.rg ? data.rg.trim() : null,
		passport: data.passport ? data.passport : null,
		phoneNumber: data.phoneNumber,
		birthDate: data.birthDate,
		nacionality: data.nacionality,
		sex: data.sex,
		participationMethod: participationMethod ?? data.participationMethod ?? undefined,
		foodRestrictions: foodRestrictions,
		delegate: userType === "delegate" ? delegate : undefined,
		delegationAdvisor: userType === "advisor" ? delegationAdvisor : undefined,
	}
}

export async function createUser(data: any) {
	const user = await prisma.user.create({ data })

	return user
}

export async function deleteUserById(id: User["id"]) {
	return prisma.user.delete({ where: { id } });
}

export async function verifyLogin(
	email: User["email"],
	password: Password["hash"],
) {
	const userWithPassword = await prisma.user.findUnique({
		where: { email },
		include: {
			password: true,
			delegation: {
				select: {
					id: true
				}
			}
		},
	});

	if (!userWithPassword || !userWithPassword.password) {
		return null;
	}

	const isValid = await bcrypt.compare(
		password,
		userWithPassword.password.hash,
	);

	if (!isValid) {
		return null;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { password: _password, ...userWithoutPassword } = userWithPassword;

	return userWithoutPassword;
}

export async function ensureStripeCostumer(user: User) {
	if (user.stripeCustomerId) {
		return
	}

	const searchResults = await stripe.customers.search({
		query: `email:\'${user.email}\'`
	});

	if (searchResults.data[0]) {
		await stripe.customers.update(
			searchResults.data[0].id,
			{ metadata: { userId: user.id, } }
		)

		await prisma.user.update({
			where: {
				id: user.id
			},
			data: {
				stripeCustomerId: searchResults.data[0].id
			}
		})

		return;
	}

	const customer = await stripe.customers.create({
		email: user.email,
		name: user.name,
		metadata: {
			userId: user.id,
		}
	})

	await prisma.user.update({
		where: {
			id: user.id
		},
		data: {
			stripeCustomerId: customer.id
		}
	})
}

export async function getUserType(userId: User["id"] | undefined) {
	if (!userId) return undefined

	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: {
			leader: true,
			delegate: true,
			delegationAdvisor: true,
		}
	})

	if (user === null) {
		return
	}

	return user.delegate ? "delegate" : "advisor"
}

export async function updateConfirmationCode(email: User["email"], code: string, minutesToExpire: number) {
	const expirationTime = new Date()
	expirationTime.setMinutes(expirationTime.getMinutes() + minutesToExpire)

	let user = await prisma.user.update({
		where: {
			email: email
		},
		data: {
			confirmationCode: {
				set: {
					code: code,
					expiresAt: expirationTime
				}
			}
		}
	})

	return user
}

export async function unsetConfirmationCode(email: User["email"]) {
	let user = await prisma.user.update({
		where: {
			email
		},
		data: {
			confirmationCode: {
				unset: true
			}
		}
	})

	return user
}

export async function getConfirmationCode(email: User["email"]) {
	let user = await prisma.user.findFirst({
		where: {
			email: email
		},
		select: {
			confirmationCode: {
				select: {
					code: true,
					expiresAt: true,
				}
			}
		}
	})

	if (!user?.confirmationCode) throw new Error("Código Inválido")

	return user.confirmationCode
}


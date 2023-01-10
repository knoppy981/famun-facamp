import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";
import { stripe } from "~/stripe.server";

export async function getUserById(id) {
	return prisma.user.findUnique({
		where: { id },
		include: {
			delegate: {
				include: {
					EmergencyContact: true,
					languagesSimulates: true
				}
			},
			delegationAdvisor: {
				include: {
					socialMedia: true
				}
			},
		}
	});
}

export async function getUserByEmail(email) {
	return prisma.user.findUnique({ 
		where: { email },
		include: {
			delegate: {
				include: {
					EmergencyContact: true,
					languagesSimulates: true
				}
			},
			delegationAdvisor: {
				include: {
					socialMedia: true
				}
			},
		}
	});
}

export async function getExistingUser(values) {
	const checkableValues = Object.entries(values).map(entry => {
		return { [entry[0]]: entry[1] };
	})

	return prisma.user.findFirst({
		where: {
			OR: checkableValues
		}
	})
}

export async function updateUser({ userId, values }) {
	return prisma.user.update({
		where: {
			id: userId
		},
		data: values
	})
}

export async function createUser(data) {
	let language
	if (Array.isArray(data?.language)) {
		const auxArray = []
		data?.language.forEach(element => {
			auxArray.push({ language: element })
		})
		language = auxArray
	} else {
		language = [{ language: data?.language }]
	}

	const delegate = {
		create: {
			councilPreference: data?.council?.replace(/ /g, "_"),
			languagesSimulates: {
				createMany: {
					data: language
				}
			}
		}
	}

	const createSocialMedia = data.Facebook || data.Instagram || data.Linkedin
	console.log("HAHA")
	console.log(createSocialMedia)

	const delegationAdvisor = {
		create: {
			advisorRole: data?.role,
			socialMedia: createSocialMedia ? {
				createMany: {
					data: [
						data.Facebook ? { socialMediaName: "Facebook", username: data.Facebook } : undefined,
						data.Instagram ? { socialMediaName: "Instagram", username: data.Instagram } : undefined,
						data.Linkedin ? { socialMediaName: "Linkedin", username: data.Linkedin } : undefined,
					]
				}
			} : undefined
		}
	}

	const user = await prisma.user.create({
		data: {
			name: data.name,
			email: data.email,
			password: {
				create: {
					hash: await bcrypt.hash(data.password, 10)
				}
			},
			cpf: data.cpf,
			rg: data.rg,
			birthDate: data.birthDate,
			phoneNumber: data.phoneNumber,
			nacionality: data.nacionality,
			delegate: data.userType === "delegate" ? delegate : undefined,
			delegationAdvisor: data.userType === "advisor" ? delegationAdvisor : undefined,
		}
	})

	return user
}

export async function deleteUserByEmail(email) {
	return prisma.user.delete({ where: { email } });
}

export async function verifyLogin(
	email,
	password
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
		userWithPassword.password.hash
	);

	if (!isValid) {
		return null;
	}

	const { password: _password, ...userWithoutPassword } = userWithPassword;

	return userWithoutPassword;
}

export async function checkSubscription(user) {
	if (!user.stripeCustomerId) return false
	if (!user.stripeSubscriptionId) return false
	if (user.stripeSubscriptionStatus != 'active' && user.stripeSubscriptionStatus != 'trialing') return false

	return true
}

export async function ensureStripeCostumer(user) {
	if (user.stripeCustomerId) {
		return;
	}

	const customer = await stripe.customers.create({
		email: user.email,
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

export async function getUserType(userId) {
	if (!userId) return undefined

	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: {
			leader: true,
			delegate: true,
			delegationAdvisor: true,
		}
	})

	return user.delegate ? "delegate" : "delegateAdvisor"
}

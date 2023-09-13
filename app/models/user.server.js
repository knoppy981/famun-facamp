import bcrypt from "bcryptjs";
import qs from 'qs'

import { prisma } from "~/db.server";
import { stripe } from "~/stripe.server";
import { ValidationError } from "~/utils";

export async function getUserById(id) {
	return prisma.user.findUnique({
		where: { id },
		include: {
			delegate: true,
			delegationAdvisor: true,
		}
	});
}

export async function getUserByEmail(email) {
	return prisma.user.findUnique({
		where: { email },
		include: {
			delegate: true,
			delegationAdvisor: true,
		}
	});
}

export async function getExistingUser({ userId, ...values }) {
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

	console.log(user)

	let field
	let errorMsg

	if (values.email === user.email) {
		field = "email"
		errorMsg = "E-mail already taken"
	} else if (values.name === user.name) {
		field = "name"
		errorMsg = "Name already taken"
	} else if (values.document.is.value === user.document.value) {
		field = user.document.documentName
		errorMsg = `${user.document.documentName} already taken`
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

export async function updateUser({ userId, values }) {
	return prisma.user.update({
		where: {
			id: userId
		},
		data: values,
		include: {
			delegate: true,
			delegationAdvisor: true,
		}
	})
}

export async function formatUserData({
	data,
	childrenModification,
	userType
}) {
	let delegate
	let delegationAdvisor
	let document

	if (data.delegate) {
		delete data.delegate.id
		delete data.delegate.userId
		delegate = { [childrenModification]: data.delegate }
	} else {
		delegate = {
			create: {
				councilPreference: Object.values(qs.parse(data?.councilPreference))/* .map(function (item) { return item.replace(/ /g, "_")}) */,
				languagesSimulates: data?.languagesSimulates,
				emergencyContactName: data.emergencyContactName,
				emergencyContactPhoneNumber: data.emergencyContactPhoneNumber,
			}
		}
	}

	if (data.delegationAdvisor) {
		delete data.delegationAdvisor.id
		delete data.delegationAdvisor.userId
		delegationAdvisor = { [childrenModification]: data.delegationAdvisor }
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

	if (data.document) {
		document = data.document
	} else {
		document = {
			documentName: data.cpf ? "cpf" : "passport",
			value: data.cpf ?? data?.passport
		}
	}

	return {
		name: data.name,
		email: data.email,
		password: data.password ? {
			create: {
				hash: await bcrypt.hash(data.password, 10)
			}
		} : undefined,
		document: document,
		birthDate: data.birthDate,
		phoneNumber: data.phoneNumber,
		nacionality: data.nacionality,
		delegate: userType === "delegate" ? delegate : undefined,
		delegationAdvisor: userType === "advisor" ? delegationAdvisor : undefined,
	}
}

export async function createUser(data) {
	const user = await prisma.user.create({ data: data })

	await ensureStripeCostumer(user)

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

	return user.delegate ? "delegate" : "advisor"
}

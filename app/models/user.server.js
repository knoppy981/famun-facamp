import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";

export async function getUserById(id) {
	return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email) {
	return prisma.user.findUnique({ where: { email } });
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
	console.log(data)

	const council = data?.council?.replace(/ /g, "_")

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
			councilPreference: council,
			languagesSimulates: {
				createMany: {
					data: language
				}
			}
		}
	}

	const delegationAdvisor = {
		create: {
			advisorRole: data?.role,
			socialMedia: {
				createMany: {
					data: [
						data.Facebook ? { socialMediaName: "Facebook", username: data.Facebook } : undefined,
						data.Instagram ? { socialMediaName: "Instagram", username: data.Instagram } : undefined,
						data.Linkedin ? { socialMediaName: "Linkedin", username: data.Linkedin } : undefined,
					]
				}
			}
		}
	}

	return prisma.user.create({
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
			delegate: data.userType === "delegate" ? delegate : undefined,
			delegationAdvisor: data.userType === "advisor" ? delegationAdvisor : undefined,
		}
	})

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
			delegate: {
				select: {
					delegationId: true
				}
			},
			delegationAdvisor: {
				select: {
					delegationId: true
				}
			},
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

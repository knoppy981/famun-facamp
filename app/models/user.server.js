import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";

export async function getUserById(id) {
	return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email) {
	return prisma.user.findUnique({ where: { email } });
}

export async function getExistingUser(cpf, rg) {
	return prisma.user.findFirst({
		where: {
			OR: [
				{cpf: parseInt(cpf)},
				{rg: parseInt(rg)}
			]
		}
	})
}

export async function createUser(info) {
	const hashedPassword = await bcrypt.hash(info.password, 10);

	return prisma.user.create({
		data: {
			email: info.email,
			name: info.name,
			password: {
				create: {
					hash: hashedPassword,
				},
			},
			cpf: parseInt(info.cpf),
			rg: parseInt(info.rg),
			country: info.country,
			phoneNumber: info.phoneNumber,
			dateOfBirth: info.birthDate,
		},
	});
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

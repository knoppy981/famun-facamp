import type { Admin } from "@prisma/client";
import { prisma } from "~/db.server";
import bcrypt from "bcryptjs";

export async function getAdminById(id: Admin["id"]) {
	return prisma.admin.findUnique({
		where: { id }
	})
}

export async function updateAdmin({
	email,
	adminId,
	values
}: {
	email?: Admin["email"] | undefined; adminId?: Admin["id"] | undefined; [key: string]: string | any
}) {
	return prisma.admin.update({
		where: {
			id: adminId,
			email: email,
		},
		data: values,
	})
}

export async function updateAdminConfirmationCode(email: Admin["email"], code: string, minutesToExpire: number) {
	const expirationTime = new Date()
	expirationTime.setMinutes(expirationTime.getMinutes() + minutesToExpire)

	let admin = await prisma.admin.update({
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

	return admin
}

export async function unsetAdminConfirmationCode(email: Admin["email"]) {
	let user = await prisma.admin.update({
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

export async function getAdminConfirmationCode(email: Admin["email"]) {
	let user = await prisma.admin.findFirst({
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

export async function verifyAdmin(email: Admin["email"], password: Admin["hash"]) {
	const admin = await prisma.admin.findUnique({
		where: {
			email
		}
	})

	if (!admin) return null

	const isValid = await bcrypt.compare(
		password,
		admin.hash
	);

	console.log(isValid)

	if (!isValid) {
		return null;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { hash: _hash, ...adminWithoutPassword } = admin

	return adminWithoutPassword
}
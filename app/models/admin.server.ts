import type { Admin } from "@prisma/client";
import { prisma } from "~/db.server";

export async function getAdminById(id: Admin["id"]) {
  return prisma.admin.findUnique({
    where: { id }
  })
}

export async function verifyAdmin(email: Admin["email"], password: Admin["password"]) {
  const admin = await prisma.admin.findUnique({
    where: {
      email
    }
  })

  if (!admin) return null

  const isValid = admin.password === password

  if (!isValid) {
    return null;
  }

  const { password: _password, ...adminWithoutPassword } = admin

  return adminWithoutPassword
}
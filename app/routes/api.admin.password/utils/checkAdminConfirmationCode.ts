import { getAdminConfirmationCode } from "~/models/admin.server"

export async function checkAdminConfirmationCode(email: string, input: string) {
  let confirmationCode = await getAdminConfirmationCode(email)
  const now = new Date()

  if (!confirmationCode || now > confirmationCode.expiresAt || input !== confirmationCode.code) {
    throw new Error("Código Inválido")
  } else {
    return confirmationCode.expiresAt
  }
}
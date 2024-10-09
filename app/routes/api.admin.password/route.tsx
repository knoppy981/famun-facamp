import React from 'react'
import { ActionFunctionArgs, json } from '@remix-run/node'
import { requireAdminId } from '~/session.server';
import { seeNotification } from '~/models/notifications.server';
import { getAdminById, unsetAdminConfirmationCode, updateAdmin } from '~/models/admin.server';
import { generateString } from '~/utils';
import { sendEmail } from '~/nodemailer.server';
import { adminRequestPasswordReset } from '~/lib/emails';
import { updateAdminConfirmationCode } from '../../models/admin.server';
import { checkAdminConfirmationCode } from './utils/checkAdminConfirmationCode';
import { generateHash } from './utils/generateHash';

export const action = async ({ request }: ActionFunctionArgs) => {
  const adminId = await requireAdminId(request)
  const admin = await getAdminById(adminId)
  if (!admin?.email) throw new Error("Erro interno, e-mail de administrador não reconhecido")
  const email = admin.email

  const formData = await request.formData()
  const action = formData.get("action")
  const code = formData.get("code")
  //request
  try {
    if (action === "request") {
      let code = generateString(6)
      await updateAdminConfirmationCode(email, code, 15)
      const info = await sendEmail({
        to: "famun@facamp.com.br",
        subject: `Organizadores, este é código ${code}`,
        html: adminRequestPasswordReset(code)
      })

      return json({ confirmed: "request" })

    } else if (action === "challenge") {
      if (typeof code !== "string") throw new Error("Código não recebido")
      let expiresAt = await checkAdminConfirmationCode(email, code)

      return json({ confirmed: "challenge", code: code })

    } else if (action === "reset") {
      if (typeof code !== "string") throw new Error("Código não recebido")
      let expiresAt = await checkAdminConfirmationCode(email, code)

      const password = formData.get("password")
      const confirmPassword = formData.get("confirmPassword")

      if (password !== confirmPassword) throw new Error("Senhas diferentes!")

      const user = await updateAdmin({
        email: email as string,
        values: {
          hash: await generateHash(password as string)
        }
      })

      await unsetAdminConfirmationCode(user.email)

      return json({ confirmed: "reset" })
    }
  } catch (error: any) {
    return json({ confirmed: "error", message: error?.message })
  }
}
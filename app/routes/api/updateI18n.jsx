import { json, redirect } from "@remix-run/node"
import { useTranslation } from "react-i18next";
import { i18nCookie } from "~/cookies";
import remixI18n from '~/i18n/i18n.server'

export const action = async ({ request }) => {
  const formData = await request.formData();
  const locale = formData.get("locale");
  const url = formData.get("url");

  if (!locale) 
    return json(
      { error: "Unbale to update user language preference" }, 
      { status: 404 }
    )

  return redirect(url,
    { headers: { "Set-Cookie": await i18nCookie.serialize(locale) } }
  )
}
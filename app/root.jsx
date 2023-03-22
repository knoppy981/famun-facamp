import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import i18next from '~/i18n/i18n.server'
import { useTranslation } from 'react-i18next'
import { useEffect } from "react";

import { getUser } from "./session.server";
import { getUserType } from "./models/user.server";

import styles from './styles.css'

export function links() {
  return [
    {
      as: "style",
      rel: "stylesheet preload prefetch",
      href: styles,
    },
    {
      as: "style",
      rel: "stylesheet preload prefetch",
      href: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.5.0/css/flag-icon.min.css"
    }
  ];
}

export const meta = () => ({
  charset: "utf-8",
  title: "Famun Dashboard",
  viewport: "width=device-width,initial-scale=1",
});

export const loader = async ({ request }) => {
  const locale = await i18next.getLocale(request)
  console.log(i18next)
  const user = await getUser(request)
  return json({
    user,
    userType: await getUserType(user?.id),
    locale
  });
};

export default function App() {

  const { locale } = useLoaderData()

  return (
    <html lang={locale}>
      <head>
        <Meta />

        <Links />

        {typeof document === "undefined" ? "__STYLES__" : null}
      </head>

      <body>
        <Outlet />

        <ScrollRestoration />

        <Scripts />

        <LiveReload />
      </body>
    </html>
  );
}

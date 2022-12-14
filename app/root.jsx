import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import remixI18n from '~/i18n/i18n.server'
import { useTranslation } from 'react-i18next'

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
  ];
}

export const meta = () => ({
  charset: "utf-8",
  title: "Famun Dashboard",
  viewport: "width=device-width,initial-scale=1",
});

export const loader = async ({ request }) => {
  const t = await remixI18n.getFixedT(request, 'translation')
  const title = t('headTitle')
  const user = await getUser(request)
  return json({ 
    user,
    userType: await getUserType(user?.id),
    title 
  });
};

export const handle = {
  i18n: "translation"
};

export default function App() {

  const { i18n } = useTranslation()

  return (
    <html lang={i18n.language}>
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

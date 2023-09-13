import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useTranslation } from 'react-i18next'
import { useChangeLanguage } from "remix-i18next";

import i18next from '~/i18n/i18n.server'

import { getUser } from "./session.server";
import { getUserType } from "./models/user.server";

import styles from './styles.css'
import LanguageMenu from "./styled-components/components/languageMenu";

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
  "format-detection": "telephone=no"
});

export const loader = async ({ request }) => {
  const locale = await i18next.getLocale(request);
  const user = await getUser(request)
  return json({
    user,
    userType: await getUserType(user?.id),
    locale,
  });
};

export const handle = {
  i18n: "translation"
};

export default function App() {
  // Get the locale from the loader
  let { locale } = useLoaderData();

  let { i18n } = useTranslation();

  React.useEffect(() => { 
    i18n.changeLanguage(locale); 
  }, [locale, i18n]); 

  return (
    <html lang={locale} dir={i18n.dir()}>
      <head>
        <Meta />

        <Links />

        {typeof document === "undefined" ? "__STYLES__" : null}
      </head>

      <body>
        <LanguageMenu i18n={i18n} />

        <Outlet />

        <ScrollRestoration />

        <Scripts />

        <LiveReload />
      </body>
    </html>
  );
}

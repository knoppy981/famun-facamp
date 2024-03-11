import React from "react";
import type { LinksFunction, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import { getUser } from "~/session.server";
import { getUserType } from "./models/user.server";
import i18next from "~/i18n.server";

import styles from "~/styles/main.css"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  { as: "style", rel: "stylesheet preload prefetch", href: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.5.0/css/flag-icon.min.css" }
];

export const meta: MetaFunction = () => [{ title: "FAMUN" }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const locale = await i18next.getLocale(request);
  const user = await getUser(request)
  return json({
    user,
    userType: await getUserType(user?.id),
    locale
  });
};

export default function App() {
  const { locale } = useLoaderData<typeof loader>();
  
  return (
    <html lang={locale} className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

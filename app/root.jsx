import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { json } from "@remix-run/node";

import { getUser } from "./session.server";

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
  return json({
    user: await getUser(request),
  });
};


export default function App() {
  return (
    <html lang="en">
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

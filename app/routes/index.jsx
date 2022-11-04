import { redirect, json } from "@remix-run/node";

import { getUserId } from "~/session.server";

export const loader = async ({ request }) => {
  const userId = await getUserId(request)
  return userId ? redirect('/dashboard/home') : redirect('/login')
};
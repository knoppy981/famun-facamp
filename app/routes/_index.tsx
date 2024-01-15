import { redirect, LoaderFunctionArgs } from "@remix-run/node";

import { getUserId } from "~/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request)
  return userId ? redirect('/dashboard/home') : redirect('/login')
};
import { redirect, LoaderFunctionArgs } from "@remix-run/node";

import { getAdminId, getUserId } from "~/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request)
  const adminId = await getAdminId(request)
  return adminId ? redirect('/admin') : userId ? redirect('/dashboard/home') : redirect('/login')
};
import { redirect } from "@remix-run/node";

import { logout } from "~/session.server";

export const action = async ({ request }) => {
  const formData = await request.formData()
  const redirectTo = formData.get("redirectTo") ?? ""
  return logout({request, redirectTo});
};

export const loader = async () => {
  return redirect("/");
};
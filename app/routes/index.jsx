import { redirect } from "@remix-run/node";

import { requireUserId } from "~/session.server";

export const loader = async ({ request, params }) => {
	return redirect("/dashboard");
};
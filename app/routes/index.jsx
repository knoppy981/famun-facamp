import { redirect } from "@remix-run/node";

import { requireUserId } from "~/session.server";

export const loader = async ({ request, params }) => {
	const userId = await requireUserId(request);
	if (!userId) {
		throw new Response("User not found", { status: 404 });
	}
	return redirect("/dashboard/home");
};
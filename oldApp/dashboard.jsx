import { json } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

import { requireUserId } from "~/session.server";

import * as S from '~/styled-components/dashboard'

export const loader = async ({ request, params }) => {
	const userId = await requireUserId(request);
	if (!userId) {
		throw new Response("User not found", { status: 404 });
	}
	return json({ userId });
};

const Dashboard = () => {
	return (
		<S.Wrapper>
			<Outlet />
		</S.Wrapper>
	);
}

export default Dashboard
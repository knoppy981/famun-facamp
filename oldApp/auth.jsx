import { useState, useEffect } from "react";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, Link, Outlet, NavLink, useSearchParams } from "@remix-run/react";

import { getUserId } from "~/session.server";
import { useOptionalUser } from "~/utils";

import * as S from '~/styled-components/auth'

export const loader = async ({ request, params }) => {
	const userId = await getUserId(request);
	if (userId) return redirect("/");
	return json({});
};

const AuthMenu = () => {
	return (
		<S.Wrapper>
			<Outlet />
		</S.Wrapper>
	);
}

export default AuthMenu
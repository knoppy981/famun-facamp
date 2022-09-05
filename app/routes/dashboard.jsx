import { useState, useEffect } from "react";
import { json } from "@remix-run/node";
import { useLoaderData, Link, Outlet } from "@remix-run/react";

import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

import * as S from '~/styled-components/dashboard'
import * as N from '~/styled-components/navbar'

export const loader = async ({ request, params }) => {
	const userId = await requireUserId(request);
	if (!userId) {
		throw new Response("User not found", { status: 404 });
	}
	return json({ userId });
};

const Dashboard = () => {

	const data = useLoaderData()
	const user = useUser()

	return (
		<>
			<N.Nav>
				<N.NavContainer>

					<N.NavLogo>
						FAMUN 2023
					</N.NavLogo>

					<N.NavMenu>
						<N.NavItem
							to="/dashboard/home"
						>
							Início
						</N.NavItem>
						<N.NavItem
							to="/dashboard/info"
						>
							Informações
						</N.NavItem>
						<N.NavItem
							to="/dashboard/payment"
						>
							Pagamento
						</N.NavItem>
					</N.NavMenu>

					<N.UserNavMenu>
						<N.NavItem
							to="/dashboard/help"
						>
							Ajuda
						</N.NavItem>
						<N.NavItem
							to={`/dashboard/${data.userId}`}
						>
							<N.UserButton>
								{user.name}
							</N.UserButton>
						</N.NavItem>
					</N.UserNavMenu>

				</N.NavContainer>
			</N.Nav>
			<S.Wrapper>

				<Outlet />

			</S.Wrapper>
		</>
	);
}

export default Dashboard
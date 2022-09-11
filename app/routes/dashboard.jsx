import { useState, useEffect } from "react";
import { json } from "@remix-run/node";
import { useLoaderData, Link, Outlet, NavLink } from "@remix-run/react";

import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

import * as S from '~/styled-components/dashboard'
import * as N from '~/styled-components/navbar'
import * as D from '~/styled-components/dashboard/dropdownmenu'

export const loader = async ({ request, params }) => {
	const userId = await requireUserId(request);
	if (!userId) {
		throw new Response("User not found", { status: 404 });
	}
	return json({ userId });
};

const Dashboard = () => {

	const [menuOpen, setMenuOpen] = useState(false)
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
						<div
							style={{ height: "100%" }}
							onMouseEnter={() => setMenuOpen(true)}
							onMouseLeave={() => setMenuOpen(false)}
						>
							<N.NavItem
								to={`/dashboard/${data.userId}`}
							>
								<N.UserButton>
									{user.name}
								</N.UserButton>
							</N.NavItem>

							{menuOpen &&
								<D.Container>
									<D.Item>
										Perfil
									</D.Item>
									<D.Item>
										Configuração
									</D.Item>
									<NavLink
										to="/logout"
									>
										<D.Item>
											Logout
										</D.Item>
									</NavLink>
								</D.Container>}
						</div>
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
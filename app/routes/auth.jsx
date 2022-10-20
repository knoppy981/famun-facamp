import { useState, useEffect } from "react";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, Link, Outlet, NavLink, useSearchParams } from "@remix-run/react";

import { getUserId } from "~/session.server";
import { useOptionalUser } from "~/utils";

import * as S from '~/styled-components/auth'
import * as N from '~/styled-components/navbar'
import * as D from '~/styled-components/components/drop-down-menu/dropdownmenu'
import { BsGlobe2 } from "react-icons/bs";

export const loader = async ({ request, params }) => {
	const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

const AuthMenu = () => {

  const [searchParams] = useSearchParams();
	const data = useLoaderData()
	const user = useOptionalUser()
  
	const [menuOpen, setMenuOpen] = useState(false)

	return (
		<>
			<N.Nav>
				<N.NavContainer>
					<N.NavLogo to="https://famun.com.br/">
						<N.NavLogoImage src="https://famun.com.br/wp-content/uploads/2022/05/famun-logo-maior.png" />
					</N.NavLogo>

					<N.NavMenu>
						<N.NavItem
							to={{
                pathname: "/auth/login",
                /* search: searchParams.toString(), */
              }}
						>
							Entrar
						</N.NavItem>

						<N.NavItem
							to={{
                pathname: "/auth/join",
                /* search: searchParams.toString(), */
              }}
						>
							Cadastrar
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
								to={'/'}
							>
								<N.UserButton>
									<BsGlobe2 />
                  PT - BR
								</N.UserButton>
							</N.NavItem>

							{menuOpen &&
								<D.Container>
									<D.Item>
										Mudar Idioma
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
								</D.Container>
              }
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

export default AuthMenu
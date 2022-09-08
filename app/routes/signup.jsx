import { json, redirect } from "@remix-run/node";
import { useSearchParams, useLoaderData, Outlet, NavLink, useMatches } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";

import { getUserId, getSignupSession } from "~/session.server";

import * as S from '~/styled-components/auth'
import * as N from '~/styled-components/navbar'

export const loader = async ({ request }) => {
	const userId = await getUserId(request)
	if (userId) return redirect("/")
	const keys = ["step"]
	const step = await getSignupSession({ request, keys })
	return json({step})
}

export const meta = () => {
	return {
		title: "Sign Up",
	};
};

const Signin = () => {

	const data = useLoaderData()

	return (
		<>
			<N.Nav>
				<N.NavContainer>

					<N.NavLogo>
						FAMUN 2023
					</N.NavLogo>

					<N.UserNavMenu>
						<N.NavItem
							to="/dashboard/help"
						>
							Ajuda
						</N.NavItem>
						<N.NavItem
							to={`/language`}
						>
							<N.UserButton>
								PT - BR
							</N.UserButton>
						</N.NavItem>
					</N.UserNavMenu>

				</N.NavContainer>
			</N.Nav>
			<S.Wrapper>
				<S.FormContainer>

					<S.StepsContainer>
						{[{
							link: "/signup/step1"
						}, {
							link: "/signup/step2"
						}, {
							link: "/signup/step3"
						}].map((item, index) => (
							<NavLink
								key={index}
								to={item.link}
								onClick={e => e.preventDefault()}
							>
								{({ isActive }) => (
									<S.Step
										active={
											isActive ? 'black' : data.step > index + 1 ? 'green' : 'gray'
										}
									>
										Passo {" "} {index + 1}
									</S.Step>
								)}
							</NavLink>
						))}
					</S.StepsContainer>

					<Outlet />

					<S.LinkContainer>
						Already have an account? {" "}
						<S.FormLink
							to="/login"
						>
							Log in
						</S.FormLink>
					</S.LinkContainer>

				</S.FormContainer>
			</S.Wrapper>
		</>

	)
}

export default Signin
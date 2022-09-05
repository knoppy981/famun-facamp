import { json, redirect } from "@remix-run/node";
import { useSearchParams, useLoaderData, Outlet, NavLink, useMatches } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";

import { getUserId } from "~/session.server";

import * as S from '~/styled-components/auth'
import * as N from '~/styled-components/navbar'

let img = "https://famun.com.br/wp-content/uploads/2022/04/icone_titulo.png"

export const loader = async ({ request }) => {
	const userId = await getUserId(request)
	if (userId) return redirect("/")
	return json({})
}

export const meta = () => {
	return {
		title: "Sign Up",
	};
};

const Signin = () => {

	const data = useLoaderData()

	const matches = useMatches();
	const [step, setStep] = useState(1)

	useEffect(() => {
		setStep(matches.at(-1).id.at(-1))
	}, [matches]);

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
						}, {
							link: "/signup/step4"
						}].map((item, index) => (
							<S.Step
								key={index}
								active={
									step == index + 1 ? 'black' : step < index + 1 ? 'gray' : 'green'
								}
							>
								Passo {" "} {index + 1}
							</S.Step>
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
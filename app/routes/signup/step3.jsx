import { useEffect, useState, useRef } from 'react'

import { json, redirect } from "@remix-run/node"
import { useLoaderData, NavLink } from '@remix-run/react'

import { getSignupSession } from '~/session.server'

import * as S from '~/styled-components/auth'

export const loader = async ({ request }) => {
	const url = new URL(request.url);

	const keys = ["step"]
	const data = await getSignupSession({ request, keys })

	const redirectIf = url.pathname.replace(/.$/, data[0])
	const goBackLink = url.pathname.replace(/.$/, url.pathname.at(-1) - 1)

	if (url.pathname.at(-1) > data) {
		return redirect(redirectIf)
	}
	return json({ data, goBackLink })
}

const step3 = () => {

	const loaderData = useLoaderData()

	return (
		<S.AuthForm>
			<S.DelegationButtonsContainer>
				<S.DelegationButton>
					Cire uma nova delegação
				</S.DelegationButton>
				<S.DelegationButton>
					Entre em uma delegação
				</S.DelegationButton>
			</S.DelegationButtonsContainer>
			<S.ButtonContainer>
				<NavLink
					to={loaderData.goBackLink}
				>
					Voltar
				</NavLink>
				<S.SubmitButton
					type="submit"
				>
					Continuar
				</S.SubmitButton>
			</S.ButtonContainer>
		</S.AuthForm>
	)
}

export default step3
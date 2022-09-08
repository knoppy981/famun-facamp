import { useEffect, useState, useRef } from 'react'

import { json, redirect } from "@remix-run/node"
import { useLoaderData, useActionData, NavLink, useSearchParams } from '@remix-run/react'
import { safeRedirect } from '~/utils'

import { createUser } from '~/models/user.server'
import { getSignupSession, createSignupSession, createUserSession } from '~/session.server'

import * as S from '~/styled-components/auth'

export const action = async ({ request }) => {

	const redirectTo = safeRedirect(formData.get("redirectTo"), "/");
	const keys = ["step", "userName", "userEmail", "userPassword", "cpf", "rg", "phoneNumber", "country", "birthDate"]
	const info = await getSignupSession({ request, keys })

	const signupData = {}

	info.forEach((element, index) => {
		signupData[keys[index]] = element
	})

	const user = await createUser(signupData)

	console.log(user)

	return createUserSession({
		request,
		userId: user.id,
		remember: false,
		redirectTo,
	})
}

export const loader = async ({ request }) => {
	const url = new URL(request.url);

	const keys = ["step"]
	const step = await getSignupSession({ request, keys })

	const redirectIf = url.pathname.replace(/.$/, step)
	const goBackLink = url.pathname.replace(/.$/, url.pathname.at(-1) - 1)

	if (url.pathname.at(-1) > step) {
		return redirect(redirectIf)
	}
	return json({ goBackLink })
}

const step3 = () => {

	const loaderData = useLoaderData()
	const actionData = useActionData()
	const redirectTo = searchParams.get("redirectTo") ?? undefined;

	useEffect(() => {
		console.log(actionData?.signupData)
	}, [actionData])

	return (
		<S.AuthForm
			method="post"
			noValidate
		>

			<input type="hidden" name="redirectTo" value={redirectTo} />

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
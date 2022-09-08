import { json, redirect } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react";

import { createUser } from "~/models/user.server";
import { getSignupSession } from '~/session.server'
import { validateEmail, safeRedirect } from "~/utils";

export const action = async({ request }) => {

	const keys = ["step", "userName", "userEmail", "userPassword", "cpf", "rg", "phoneNumber", "country", "birthDate"]
	const data = await getSignupSession({ request, keys })

	data.map((item, index) => {
		if (item !== "" || undefined || null) {
			return json({ errors: { item: `${item} is invalid` } }, { status: 400 })
		}
	})

	return redirect()
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

const finalStep = () => {

	const loaderData = useLoaderData()

	return(
		<S.AuthForm>
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

export default finalStep
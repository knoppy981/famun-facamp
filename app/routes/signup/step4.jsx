import { useEffect, useState, useRef } from 'react'

import { json, redirect } from "@remix-run/node"
import { useLoaderData } from '@remix-run/react'

import { getSignupSession } from '~/session.server'

import * as S from '~/styled-components/auth'

export const loader = async ({ request }) => {
	const url = new URL(request.url);
	
	const keys = ["step", "userName", "userEmail", "userPassword"]
	const data = await getSignupSession({ request, keys })

	if (url.pathname.at(-1) > data[0]) {
		return redirect(url.pathname.replace(/.$/, data[0])) 
	}
	return json({data})
}

const step4 = () => {

	const data = useLoaderData()

	return (
		<S.AuthForm>
			Step 4
		</S.AuthForm>
	)
}

export default step4
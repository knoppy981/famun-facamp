import { json, redirect } from "@remix-run/node";
import { useActionData, useSearchParams, useLoaderData, useMatches } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";

import { createSignupSession, getSignupSession } from "~/session.server";
import { getUserByEmail } from "~/models/user.server";
import { safeRedirect, validateEmail } from "~/utils";

import * as S from '~/styled-components/auth'

export const action = async ({ request }) => {
	const formData = await request.formData()
	const name = formData.get("name")
	const email = formData.get("email")
	const password = formData.get("password")
	const confirmPassword = formData.get("confirmPassword")
	const redirectTo = safeRedirect("/signup/step2")

	if (typeof name !== "string" || name.length === 0) {
		return json(
			{ errors: { name: "Name is required" } },
			{ status: 400 }
		);
	}

	if (!validateEmail(email)) {
		return json(
			{ errors: { email: "Email is invalid" } },
			{ status: 400 }
		);
	}

	if (typeof password !== "string" || password.length === 0) {
		return json(
			{ errors: { password: "Password is required" } },
			{ status: 400 }
		);
	}

	if (password.length < 8) {
		return json(
			{ errors: { password: "Password is too short" } },
			{ status: 400 }
		);
	}

	if (password !== confirmPassword) {
		return json(
			{ errors: { confirmPassword: "Passwords are not matching" } },
			{ status: 400 }
		);
	}

	const existingUser = await getUserByEmail(email);

	if (existingUser) {
		return json(
			{ errors: { email: "A user already exists with this email" } },
			{ status: 400 }
		);
	}

	const data = [
		{
			key: "step",
			value: 2
		},
		{
			key: "userName",
			value: name
		},
		{
			key: "userEmail",
			value: email
		},
		{
			key: "userPassword",
			value: password
		}
	]

	/* await new Promise(resolve => setTimeout(resolve, 1000)); */

	return createSignupSession({
		request,
		data,
		redirectTo,
	})

};

export const loader = async ({ request }) => {
	const keys = ["step", "userName", "userEmail", "userPassword"]
	const data = await getSignupSession({ request, keys })
	return json({ data })
}

const Step1 = () => {

	const actionData = useActionData();
	const loaderData = useLoaderData()

	const nameRef = useRef(null);
	const emailRef = useRef(null);
	const passwordRef = useRef(null);
	const confirmPasswordRef = useRef(null);

	useEffect(() => {
		if (actionData?.errors?.name) {
			nameRef.current?.focus();
		} else if (actionData?.errors?.email) {
			emailRef.current?.focus();
		} else if (actionData?.errors?.password) {
			passwordRef.current?.focus();
		} else if (actionData?.errors?.confirmPassword) {
			confirmPasswordRef.current?.focus();
		}
	}, [actionData]);

	useEffect(() => {
		nameRef.current.value = loaderData.data[1]
		emailRef.current.value = loaderData.data[2]
		passwordRef.current.value = loaderData.data[3]
		confirmPasswordRef.current.value = loaderData.data[3]
	}, []);

	return (
		<S.AuthForm
			method="post"
			noValidate
		>
			
			<S.InputWrapper>
				<S.Label
					htmlFor="name"
				>
					Nome completo
				</S.Label>

				<S.InputContainer>
					<S.Input
						ref={nameRef}
						id="name"
						required
						autoFocus={true}
						name="name"
						type="name"
						autoComplete="name"
						aria-invalid={actionData?.errors?.name ? true : undefined}
						aria-describedby="name-error"
					/>

					{actionData?.errors?.name && (
						<S.Error id="name-error">
							{actionData.errors.name}
						</S.Error>
					)}
				</S.InputContainer>
			</S.InputWrapper>


			<S.InputWrapper>
				<S.Label
					htmlFor="email"
				>
					Email
				</S.Label>

				<S.InputContainer>
					<S.Input
						ref={emailRef}
						id="email"
						required
						name="email"
						type="email"
						autoComplete="email"
						aria-invalid={actionData?.errors?.email ? true : undefined}
						aria-describedby="email-error"
					/>

					{actionData?.errors?.email && (
						<S.Error id="email-error">
							{actionData.errors.email}
						</S.Error>
					)}
				</S.InputContainer>
			</S.InputWrapper>

			<S.DividedInputWrapper
				gridSpace={"1fr 1fr"}
			>
				<S.InputWrapper>
					<S.Label
						htmlFor="password"
					>
						Senha
					</S.Label>

					<S.InputContainer>
						<S.Input
							ref={passwordRef}
							id="password"
							required
							name="password"
							type="password"
							autoComplete="password"
							aria-invalid={actionData?.errors?.password ? true : undefined}
							aria-describedby="password-error"
						/>

						{actionData?.errors?.password && (
							<S.Error id="password-error">
								{actionData.errors.password}
							</S.Error>
						)}
					</S.InputContainer>
				</S.InputWrapper>

				<S.InputWrapper>
					<S.Label
						htmlFor="confirmPassword"
					>
						Confirme a Senha
					</S.Label>

					<S.InputContainer>
						<S.Input
							ref={confirmPasswordRef}
							id="confirmPassword"
							required
							name="confirmPassword"
							type="password"
							autoComplete="password"
							aria-invalid={actionData?.errors?.password ? true : undefined}
							aria-describedby="confirmPassword-error"
						/>

						{actionData?.errors?.confirmPassword && (
							<S.Error id="confirmPassword-error">
								{actionData.errors.confirmPassword}
							</S.Error>
						)}
					</S.InputContainer>
				</S.InputWrapper>

			</S.DividedInputWrapper>

			<S.ButtonContainer>
				<div></div>
				<S.SubmitButton
					type="submit"
				>
					Continuar
				</S.SubmitButton>
			</S.ButtonContainer>

		</S.AuthForm>
	)
}

export default Step1
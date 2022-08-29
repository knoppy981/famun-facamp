import { json, redirect } from "@remix-run/node";
import { useActionData, useSearchParams } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";

import { getUserId, createUserSession } from "~/session.server";
import { createUser, getUserByEmail } from "~/models/user.server";
import { safeRedirect, validateEmail } from "~/utils";

import * as S from '~/styled-components/auth'

export const loader = async ({ request }) => {
	const userId = await getUserId(request)
	if (userId) return redirect("/")
	return json({})
}

export const action = async ({ request }) => {
	const formData = await request.formData()
	const name = formData.get("name")
	const email = formData.get("email")
	const password = formData.get("password")
	const confirmPassword = formData.get("confirmPassword")

	const redirectTo = safeRedirect(formData.get("redirectTo"), "/")

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

	const user = await createUser(email, password, name);

	return createUserSession({
		request,
		userId: user.id,
		remember: false,
		redirectTo,
	});
};

export const meta = () => {
	return {
		title: "Sign Up",
	};
};

const Signin = () => {

	const [searchParams] = useSearchParams();
	const redirectTo = searchParams.get("redirectTo") ?? undefined;
	const actionData = useActionData();

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

	return (
		<S.Wrapper>
			<S.FormContainer>
				<S.Logo
					style={{
						/* backgroundImage: `url(${img})`, */
					}}
				>
					Famun 2023
				</S.Logo>

				<S.AuthForm
					method="post"
					noValidate
				>
					<S.InputWrapper>
						<S.Label
							htmlFor="name"
						>
							Nome
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

					<input type="hidden" name="redirectTo" value={redirectTo} />

					<S.SubmitButton
						type="submit"
					>
						Sign Up
					</S.SubmitButton>

					<S.LinkContainer>
						Already have an account? {" "}
						<S.FormLink
							to="/login"
						>
							Log in
						</S.FormLink>
					</S.LinkContainer>
				</S.AuthForm>

			</S.FormContainer>
		</S.Wrapper>
	)
}

export default Signin
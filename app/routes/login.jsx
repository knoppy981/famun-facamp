import { json, redirect } from "@remix-run/node";
import { useActionData, useSearchParams } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";

import { getUserId, createUserSession } from "~/session.server";
import { verifyLogin } from "~/models/user.server";
import { safeRedirect, validateEmail } from "~/utils";

import * as S from '~/styled-components/auth'
import img from '~/images/Famun.jpeg'

export const loader = async ({ request }) => {
	const userId = await getUserId(request);
	if (userId) return redirect("/");
	return json({});
};

export const action = async ({ request }) => {
	const formData = await request.formData();
	const email = formData.get("email");
	const password = formData.get("password");
	const redirectTo = safeRedirect(formData.get("redirectTo"), "/");
	const remember = formData.get("remember");

	if (!validateEmail(email)) {
		return json({ errors: { email: "Email is invalid" } }, { status: 400 });
	}

	if (typeof password !== "string" || password.length === 0) {
		return json(
			{ errors: { password: "Password is required" } },
			{ status: 400 }
		);
	}

	if (password.length < 8) {
		return json(
			{ errors: { password: "Password must have at least 8 characters" } },
			{ status: 400 }
		);
	}

	const user = await verifyLogin(email, password);

	if (!user) {
		return json(
			{ errors: { email: "Invalid email or password" } },
			{ status: 400 }
		);
	}

	return createUserSession({
		request,
		userId: user.id,
		remember: /* remember === "on" ? true :  */false,
		redirectTo,
	});
}

export const meta = () => {
	return {
		title: "Log In",
	};
};

const Login = () => {

	const [searchParams] = useSearchParams();
	const redirectTo = searchParams.get("redirectTo") ?? undefined;
	const actionData = useActionData();
	const emailRef = useRef(null);
	const passwordRef = useRef(null);

	useEffect(() => {
		if (actionData?.errors?.email) {
			emailRef.current?.focus();
		} else if (actionData?.errors?.password) {
			passwordRef.current?.focus();
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
							htmlFor="email"
						>
							Email
						</S.Label>

						<S.InputContainer>
							<S.Input
								ref={emailRef}
								id="email"
								required
								autoFocus={true}
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

					<S.InputWrapper>
						<S.Label
							htmlFor="password"
						>
							Password
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

          <input type="hidden" name="redirectTo" value={redirectTo} />

					<S.SubmitButton
						type="submit"
					>
						Login
					</S.SubmitButton>

					<S.LinkContainer>
						Dont't have an account? {" "}
						<S.FormLink
							to="/signup"
						>
							Sign up
						</S.FormLink>
					</S.LinkContainer>
				</S.AuthForm>

			</S.FormContainer>
		</S.Wrapper>
	)
}

export default Login
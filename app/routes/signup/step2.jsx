import { useEffect, useState, useRef } from 'react'

import { json, redirect } from "@remix-run/node"
import { useLoaderData, useActionData, NavLink } from '@remix-run/react'

import { getSignupSession, createSignupSession } from '~/session.server'
import { safeRedirect, validatePhoneNumber } from "~/utils";

import * as S from '~/styled-components/auth'

export const action = async ({ request }) => {
	const formData = await request.formData()
	const cpf = formData.get("cpf")
	const rg = formData.get("rg")
	const phoneNumber = formData.get("phoneNumber")
	const country = formData.get("country")
	const birthDate = formData.get("birthDate")
	const redirectTo = safeRedirect("/signup/step3")

	if (typeof cpf !== "string" || cpf.length !== 11) {
		return json(
			{ errors: { cpf: "Cpf is required" } },
			{ status: 400 }
		);
	}

	if (typeof rg !== "string" || rg.length !== 9) {
		return json(
			{ errors: { rgRef: "Rg is required" } },
			{ status: 400 }
		);
	}

	if (!validatePhoneNumber(phoneNumber)) {
		return json(
			{ errors: { phoneNumber: "Phone Number is invalid" } },
			{ status: 400 }
		);
	}

	if (typeof country !== "string" || country.length === 0) {
		return json(
			{ errors: { country: "Country is required" } },
			{ status: 400 }
		);
	}

	if (birthDate === null) {
		return json(
			{ errors: { birthDate: "Birth Date is invalid" } },
			{ status: 400 }
		);
	}

	const data = [
		{
			key: "step",
			value: 3
		},
		{
			key: "cpf",
			value: cpf
		},
		{
			key: "rg",
			value: rg
		},
		{
			key: "phoneNumber",
			value: phoneNumber
		},
		{
			key: "country",
			value: country
		},
		{
			key: "birthDate",
			value: birthDate
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
	const url = new URL(request.url);
	
	const keys = ["step", "cpf", "rg", "phoneNumber", "country", "birthDate"]
	const data = await getSignupSession({ request, keys })
	
	const redirectIf = url.pathname.replace(/.$/, data[0])
	const goBackLink = url.pathname.replace(/.$/, url.pathname.at(-1) - 1)

	if (url.pathname.at(-1) > data[0] + 1) {
		return redirect(redirectIf)
	}
	return json({ data, goBackLink })
}

const step2 = () => {

	const actionData = useActionData();
	const loaderData = useLoaderData()

	const cpfRef = useRef(null);
	const rgRef = useRef(null);
	const phoneNumberRef = useRef(null);
	const countryRef = useRef(null);
	const birthDateRef = useRef(null);


	useEffect(() => {
		if (actionData?.errors?.cpfRfg) {
			cpfRef.current?.focus();
		} else if (actionData?.errors?.rgRef) {
			rgRef.current?.focus();
		} else if (actionData?.errors?.phoneNumberRef) {
			phoneNumberRef.current?.focus();
		} else if (actionData?.errors?.countryRef) {
			countryRef.current?.focus();
		} else if (actionData?.errors?.birthDateRef) {
			birthDateRef.current?.focus();
		}
	}, [actionData]);

	useEffect(() => {
		cpfRef.current.value = loaderData.data[1]
		rgRef.current.value = loaderData.data[2]
		phoneNumberRef.current.value = loaderData.data[3]
		countryRef.current.value = loaderData.data[4]
		birthDateRef.current.value = loaderData.data[5]
	}, []);

	return (
		<S.AuthForm
			method="post"
			noValidate
		>
			<S.DividedInputWrapper
				gridSpace={"1fr 1fr"}
			>
				<S.InputWrapper>
					<S.Label
						htmlFor="cpf"
					>
						CPF
					</S.Label>

					<S.InputContainer>
						<S.Input
							ref={cpfRef}
							id="cpf"
							required
							autoFocus={true}
							name="cpf"
							type="number"
							autoComplete="cpf"
							aria-invalid={actionData?.errors?.cpf ? true : undefined}
							aria-describedby="cpf-error"
						/>

						{actionData?.errors?.cpf && (
							<S.Error id="cpf-error">
								{actionData.errors.cpf}
							</S.Error>
						)}
					</S.InputContainer>
				</S.InputWrapper>


				<S.InputWrapper>
					<S.Label
						htmlFor="rg"
					>
						RG
					</S.Label>

					<S.InputContainer>
						<S.Input
							ref={rgRef}
							id="rg"
							required
							name="rg"
							type="number"
							autoComplete="rg"
							aria-invalid={actionData?.errors?.rg ? true : undefined}
							aria-describedby="rg-error"
						/>

						{actionData?.errors?.rg && (
							<S.Error id="rg-error">
								{actionData.errors.rg}
							</S.Error>
						)}
					</S.InputContainer>
				</S.InputWrapper>
			</S.DividedInputWrapper>

			<S.InputWrapper>
				<S.Label
					htmlFor="phoneNumber"
				>
					Número Celular
				</S.Label>

				<S.InputContainer>
					<S.Input
						ref={phoneNumberRef}
						id="phoneNumber"
						required
						name="phoneNumber"
						type="string"
						autoComplete="phoneNumber"
						aria-invalid={actionData?.errors?.phoneNumber ? true : undefined}
						aria-describedby="phoneNumber-error"
					/>

					{actionData?.errors?.phoneNumber && (
						<S.Error id="phoneNumber-error">
							{actionData.errors.phoneNumber}
						</S.Error>
					)}
				</S.InputContainer>
			</S.InputWrapper>

			<S.InputWrapper>
				<S.Label
					htmlFor="country"
				>
					País
				</S.Label>

				<S.InputContainer>
					<S.Input
						ref={countryRef}
						id="country"
						required
						name="country"
						type="string"
						autoComplete="country"
						aria-invalid={actionData?.errors?.country ? true : undefined}
						aria-describedby="country-error"
					/>

					{actionData?.errors?.country && (
						<S.Error id="country-error">
							{actionData.errors.country}
						</S.Error>
					)}
				</S.InputContainer>
			</S.InputWrapper>

			<S.InputWrapper>
				<S.Label
					htmlFor="birthDate"
				>
					Data de Nascimento
				</S.Label>

				<S.InputContainer>
					<S.Input
						ref={birthDateRef}
						id="birthDate"
						required
						name="birthDate"
						type="string"
						autoComplete="birthDate"
						aria-invalid={actionData?.errors?.birthDate ? true : undefined}
						aria-describedby="birthDate-error"
					/>

					{actionData?.errors?.birthDate && (
						<S.Error id="birthDate-error">
							{actionData.errors.birthDate}
						</S.Error>
					)}
				</S.InputContainer>
			</S.InputWrapper>


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

		</S.AuthForm >
	)
}

export default step2
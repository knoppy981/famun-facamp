import { useState, useRef, useEffect } from 'react'
import { NavLink, Outlet, useActionData, useLoaderData } from '@remix-run/react'
import { redirect, json } from '@remix-run/node';

import { safeRedirect, validateEmail, validatePhoneNumber } from "~/utils";
import { getExistingUser, getUserByEmail, createUser } from "~/models/user.server";
import { findDelegationCode, joinDelegationWithCode } from '~/models/delegation.server';
import { createUserSession } from '~/session.server';

import * as S from '~/styled-components/auth/signup'
import AuthInputBox from '~/styled-components/components/auth-input-box';


export const action = async ({ request }) => {
  const formData = await request.formData()
  const button = formData.get("button")
  const delegationId = formData.get("delegationId")
  const redirectTo = safeRedirect("/")

  const name = formData.get("name")
  const email = formData.get("email")
  const password = formData.get("password")
  const confirmPassword = formData.get("confirmPassword")
  const cpf = formData.get("cpf")
  const rg = formData.get("rg")
  const phoneNumber = formData.get("phoneNumber")
  const country = formData.get("country")
  const birthDate = formData.get("birthDate")

  if (button === "firstButton") {

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
    const existingUser = await getUserByEmail(email).catch((err) => {
      return json(
        { errors: { generalizedError: err } },
        { status: 400 }
      );
    })
    if (existingUser) {
      return json(
        { errors: { email: "A user already exists with this email" } },
        { status: 400 }
      );
    }

    return json({ nextStep: true })

  } else if (button === "secondButton") {

    if (typeof cpf !== "string" || cpf.length !== 11) {
      return json(
        { errors: { cpf: "Cpf is required" } },
        { status: 400 }
      );
    }
    if (typeof rg !== "string" || rg.length !== 9) {
      return json(
        { errors: { rg: "Rg is required" } },
        { status: 400 }
      );
    }
    const existingUser = await getExistingUser(cpf, rg).catch((err) => {
      return json(
        { errors: { generalizedError: err } },
        { status: 400 }
      );
    })
    if (existingUser) {
      if (parseInt(cpf) === existingUser.cpf) {
        return json(
          { errors: { cpf: "A user already exists with this cpf" } },
          { status: 400 }
        );
      } else {
        return json(
          { errors: { rg: "A user already exists with this rg" } },
          { status: 400 }
        );
      }
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

    const info = {
      email,
      name,
      password,
      cpf,
      rg,
      country,
      phoneNumber,
      birthDate,
    }

    const user = await createUser(info).catch((err) => {
      return json(
        { errors: { generalizedError: err } },
        { status: 400 }
      );
    })

    await joinDelegationWithCode(user.id, delegationId).catch((err) => {
      return json(
        { errors: { generalizedError: err } },
        { status: 400 }
      );
    })

    return createUserSession({
      request,
      userId: user.id,
      remember: false,
      redirectTo,
    })
  }

}

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const delegationCode = url.searchParams.get("delegationCode");
  const delegation = await findDelegationCode(delegationCode)
  if (!delegation) return redirect(`/auth/enter`)
  return json({ delegation })
}

const signup = () => {

  const actionData = useActionData()
  const loaderData = useLoaderData()

  const { delegation } = loaderData

  const [authStep, setAuthStep] = useState(0)

  useEffect(() => {
    if (actionData?.nextStep) setAuthStep(1)
  }, [actionData]);

/*   const nameRef = useRef(null)
  const emailRef = useRef(null)
  const confirmPasswordRef = useRef(null)
  const passwordRef = useRef(null)
  const cpfRef = useRef(null)
  const rgRef = useRef(null)
  const phoneNumberRef = useRef(null);
  const countryRef = useRef(null);
  const birthDateRef = useRef(null);

  const refs = { nameRef, emailRef, confirmPasswordRef, passwordRef, cpfRef, rgRef, phoneNumberRef, countryRef, birthDateRef }

  useEffect(() => {
    if (actionData?.errors) {
      refs[Object.keys(actionData.errors)[0] + 'Ref']?.current?.focus()
    }
  }, [actionData]); */


  return (
    <S.Wrapper>
      <S.FormContainer>
        <S.Subtitle>
          Entrar na <br /> <h3>{delegation.name}</h3>
        </S.Subtitle>

        <S.AuthForm method="post" noValidate>
          <S.FormStepsContainer>
            <S.StepContainer style={{ marginLeft: `-${authStep * 100}%`, opacity: authStep === 0 ? 1 : 0 }}>
              <AuthInputBox name="name" text="Nome Completo" type="string" err={actionData?.errors?.name} />

              <AuthInputBox name="email" text="Email" type="email" err={actionData?.errors?.email} />

              <S.DividedInputWrapper gridSpace={"1fr 1fr"}>
                <AuthInputBox name="password" text="Senha" type="password" err={actionData?.errors?.password} />

                <AuthInputBox name="confirmPassword" text="Confirme a Senha" type="password" err={actionData?.errors?.confirmPassword} />
              </S.DividedInputWrapper>

              <S.GeneralizedErrorBox>
                <S.GeneralizedError
                  err={actionData?.errors?.generalizedError? true : false}
                >
                  {actionData?.errors?.generalizedError}
                </S.GeneralizedError>
              </S.GeneralizedErrorBox>

              <S.ButtonContainer>
                <S.SubmitButton
                  type="submit"
                  name="button"
                  value="firstButton"
                >
                  Continuar
                </S.SubmitButton>
              </S.ButtonContainer>
            </S.StepContainer>

            <S.StepContainer style={{ opacity: authStep === 1 ? 1 : 0 }}>
              <S.DividedInputWrapper gridSpace={"1fr 1fr"} >
                <AuthInputBox name="cpf" text="Cpf" type="string" err={actionData?.errors?.cpf} />

                <AuthInputBox name="rg" text="Rg" type="string" err={actionData?.errors?.rg} />

                <AuthInputBox name="country" text="Nacionalidade" type="country" err={actionData?.errors?.country} />
              </S.DividedInputWrapper>

              <S.DividedInputWrapper gridSpace={"1fr 1fr"}>
                <AuthInputBox name="phoneNumber" text="Número de Celular" type="string" err={actionData?.errors?.phoneNumber} />

                <AuthInputBox name="birthDate" text="Data de Nascimento" type="date" err={actionData?.errors?.birthDate} />
              </S.DividedInputWrapper>

              <S.GeneralizedErrorBox>
                <S.GeneralizedError
                  err={actionData?.errors?.generalizedError? true : false}
                >
                  {actionData?.errors?.generalizedError}
                </S.GeneralizedError>
              </S.GeneralizedErrorBox>

              <S.ButtonContainer>
                <S.SubmitButton
                  type="submit"
                  name="button"
                  value="secondButton"
                >
                  Finalizar Inscrição
                </S.SubmitButton>
              </S.ButtonContainer>
            </S.StepContainer>
          </S.FormStepsContainer>

          <input type="hidden" name="delegationId" value={delegation.code} />

        </S.AuthForm>
      </S.FormContainer>
    </S.Wrapper>
  )
}

export default signup
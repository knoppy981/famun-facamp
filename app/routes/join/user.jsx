import { useState, useEffect, useRef } from 'react'
import { useActionData, useLoaderData, useSearchParams, useTransition } from '@remix-run/react'
import { json, redirect } from '@remix-run/node'
import qs from 'qs'

import { sessionStorage, getSession, createUserSession, getUserId, logout } from "~/session.server";
import { validateEmail, checkString, validatePhoneNumber, validateCpf, safeRedirect } from "~/utils";
import { createUser, getExistingUser } from '~/models/user.server';

import * as S from '~/styled-components/join/user'

import AdvisorData from "~/styled-components/join/user/advisordata"
import ConfirmData from "~/styled-components/join/user/confirmdata"
import CreateUser from "~/styled-components/join/user/createuser"
import DelegateData from "~/styled-components/join/user/delegatedata"
import Nacionality from "~/styled-components/join/user/nacionality"
import UserData from "~/styled-components/join/user/userdata"
import UserType from "~/styled-components/join/user/usertype"
import Spinner from '~/styled-components/components/spinner';



export const action = async ({ request }) => {
  const text = await request.text()
  const session = await getSession(request)
  const { redirectTo, step, action, userType, ...data } = qs.parse(text)
  const searchParams = redirectTo === "" ? "" : new URLSearchParams([["redirectTo", safeRedirect(redirectTo)]])

  if (action === 'next') {

    const userData = { name: data?.name, email: data?.email, document: { is: { value: data.cpf ?? data.passport } } }
    const user = await getExistingUser(userData)

    if (data.email?.length === 0)
      return json(
        { errors: { email: "Preencha com seu e-mail" } },
        { status: 400 }
      );
    if (data.email) {
      if (data.email === user?.email)
        return json(
          { errors: { email: "E-mail já utilizado" } },
          { status: 400 }
        );
      if (typeof data.email !== "string" || !validateEmail(data.email))
        return json(
          { errors: { email: "E-mail inválido" } },
          { status: 400 }
        );
    }

    if (data.password?.length === 0)
      return json(
        { errors: { password: "Digite a senha" } },
        { status: 400 }
      );
    if (data.confirmPassword?.length === 0)
      return json(
        { errors: { confirmPassword: "Digite a senha" } },
        { status: 400 }
      );
    if (data.password) {
      if (data.password.length < 8)
        return json(
          { errors: { password: "Senha muito curta" } },
          { status: 400 }
        );

      if (data.password !== data.confirmPassword)
        return json(
          { errors: { confirmPassword: "As senhas são diferentes" } },
          { status: 400 }
        );
    }

    if (data.name?.length === 0)
      return json(
        { errors: { name: "Preencha com o seu Nome" } },
        { status: 400 }
      );
    if (data.name) {
      if (data.name === user?.name)
        return json(
          { errors: { name: "Nome já utilizado" } },
          { status: 400 }
        );
      if (typeof data.name !== "string" || !checkString(data.name) || data.name === "")
        return json(
          { errors: { name: "Nome inválido" } },
          { status: 400 }
        );
    }

    if (data.cpf?.length === 0)
      return json(
        { errors: { cpf: "Digite seu cpf" } },
        { status: 400 }
      );
    if (data.cpf) {
      if (data.cpf === user?.document?.value && user?.document?.documentName === 'cpf')
        return json(
          { errors: { cpf: "Cpf já utilizado" } },
          { status: 400 }
        );
      if (typeof data.cpf !== "string" || data.cpf.length !== 14 || !validateCpf(data.cpf))
        return json(
          { errors: { cpf: "Cpf Inválido" } },
          { status: 400 }
        );
    }

    if (data.passport?.length === 0)
      return json(
        { errors: { passport: "Digite seu Passaporte" } },
        { status: 400 }
      );
    if (data.passport) {
      if (data.passport === user?.document?.value && user?.document?.documentName === 'passport')
        return json(
          { errors: { passport: "Passaporte já utilizado" } },
          { status: 400 }
        );
      if (typeof data.passport !== "string" || data.passport.length > 20)
        return json(
          { errors: { passport: "Passaporte Inválido" } },
          { status: 400 }
        );
    }

    if (data.phoneNumber?.length === 0)
      return json(
        { errors: { phoneNumber: "Digite seu Númro de Celular" } },
        { status: 400 }
      );
    if (data.phoneNumber) {
      if (typeof data.phoneNumber !== "string" || !validatePhoneNumber(data.phoneNumber))
        return json(
          { errors: { phoneNumber: "Número de celular inválido" } },
          { status: 400 }
        );
    }

    if (data.birthDate?.length === 0)
      return json(
        { errors: { birthDate: "Preencha a Data de nascimento" } },
        { status: 400 }
      );
    if (data.birthDate) {
      if (typeof data.birthDate !== "string" || data.birthDate.length !== 10)
        return json(
          { errors: { birthDate: "Data de Nascimento inválida" } },
          { status: 400 }
        );
    }

    const userType = session.get("user-type")?.userType

    if (step == 5 && userType === "delegate") {
      if (data.language === undefined) {
        return json(
          { errors: { language: "Escolha no mínimo uma opção" } },
          { status: 400 }
        );
      }

      if (data.emergencyContactName?.length === 0)
        return json(
          { errors: { emergencyContactName: "Preencha com um nome" } },
          { status: 400 }
        );
      if (data.emergencyContactName) {
        if (typeof data.emergencyContactName !== "string" || !checkString(data.emergencyContactName) || data.emergencyContactName === "")
          return json(
            { errors: { emergencyContactName: "Nome inválido" } },
            { status: 400 }
          );
      }

      if (data.emergencyContactPhoneNumber?.length === 0)
        return json(
          { errors: { emergencyContactPhoneNumber: "Digite um númro de celular" } },
          { status: 400 }
        );
      if (data.emergencyContactPhoneNumber) {
        if (typeof data.emergencyContactPhoneNumber !== "string" || !validatePhoneNumber(data.emergencyContactPhoneNumber))
          return json(
            { errors: { emergencyContactPhoneNumber: "Número de celular inválido" } },
            { status: 400 }
          );
      }
    }

    if (step == 6) {
      const userData = {
        ...session.get("user-data-1"),
        ...session.get("user-data-2"),
        ...session.get("user-data-3"),
        ...session.get("user-data-5"),
        ...session.get("user-type"),
      }
      const user = await createUser(userData)

      return createUserSession({
        request,
        userId: user.id,
        redirectTo: redirectTo ? safeRedirect(redirectTo) : `/join/delegation?${searchParams}`,
      });
    }
  }

  const nextStep = userType ? 5 : Number(step) + (action === 'next' ? 1 : -1)
  session.set(`user-data-${step}`, data)
  if (userType) session.set('user-type', { userType: userType })
  session.set('current-step', { step: nextStep })

  return redirect(`/join/user?${searchParams}`, {
    headers: {
      'Set-cookie': await sessionStorage.commitSession(session),
    },
  })
}

export const loader = async ({ request }) => {
  const userId = await getUserId(request)
  if (userId) return redirect("/")

  const session = await getSession(request)

  const { userType, step } = {
    ...session.get("current-step"),
    ...session.get("user-type"),
  }
  console.log(step)
  if (step === 6) {
    const data = {
      ...session.get("user-data-1"),
      ...session.get("user-data-2"),
      ...session.get("user-data-3"),
      ...session.get("user-data-5"),
    }
    return json({ data, step, userType })
  } else if (step === 3) {
    const data = {
      ...session.get(`user-data-${3}`),
      ...session.get(`user-data-${1}`),
    } ?? {}
    return json({ data, step, userType })
  } else {
    const data = session.get(`user-data-${step}`) ?? {}
    return json({ data, step, userType })
  }
}

const user = () => {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "";
  const transition = useTransition()
  const [isNextButtonClicked, setIsNextButtonClicked] = useState(false)

  useEffect(() => {
    transition.state === 'idle' && setIsNextButtonClicked(false)
  }, [transition])

  const actionData = useActionData()
  let { userType, step, data } = useLoaderData()
  if (!step) step = 1

  return (
    <S.StepsForm noValidate method='post'>
      <input type="hidden" name="step" value={step} />
      <input type="hidden" name="redirectTo" value={redirectTo} />

      <S.Container>
        {step === 1 && <Nacionality data={data} />}
        {step === 2 && <CreateUser data={data} actionData={actionData} />}
        {step === 3 && <UserData data={data} actionData={actionData} />}
        {step === 4 && <UserType data={data} actionData={actionData} />}
        {step === 5 && (userType === "advisor" ?
          <AdvisorData data={data} actionData={actionData} /> : <DelegateData data={data} actionData={actionData} />)
        }
        {step === 6 && <ConfirmData data={data} userType={userType} />}
      </S.Container>

      <S.ControlButtonsContainer>
        {step !== 4 && <S.ControlButton name="action" value="next" type="submit" onClick={() => setIsNextButtonClicked(true)}> {step === 6 ? 'Cadastrar' : 'Próximo'} {transition.state !== 'idle' && isNextButtonClicked && <Spinner dim={18} />} </S.ControlButton>}

        {step !== 1 && <S.ControlButton name="action" value="previous" type="submit" prev> Voltar </S.ControlButton>}
      </S.ControlButtonsContainer>
    </S.StepsForm>
  )
}

export default user
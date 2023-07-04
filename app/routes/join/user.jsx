import { useState, useEffect, useRef } from 'react'
import { useActionData, useLoaderData, useSearchParams, useTransition } from '@remix-run/react'
import { json, redirect } from '@remix-run/node'
import qs from 'qs'

import { sessionStorage, getSession, createUserSession, getUserId, logout } from "~/session.server";
import { checkUserInputData, safeRedirect } from "~/utils";
import { createUser, formatUserData, getExistingUser } from '~/models/user.server';

import * as S from '~/styled-components/join'

import AdvisorData from "~/styled-components/join/user/advisordata"
import ConfirmData from "~/styled-components/join/user/confirmdata"
import CreateUser from "~/styled-components/join/user/createuser"
import DelegateData from "~/styled-components/join/user/delegatedata"
import Nacionality from "~/styled-components/join/user/nacionality"
import UserData from "~/styled-components/join/user/userdata"
import UserType from "~/styled-components/join/user/usertype"
import Spinner from '~/styled-components/components/spinner';
import TermsAndConditions from '~/styled-components/join/user/termsAndConditions';

export const action = async ({ request }) => {
  // get data from form
  const text = await request.text()
  const session = await getSession(request)
  // extract variables
  const { redirectTo, step, action, userType, ...data } = qs.parse(text)
  // if there is a redirectTo, keep it in the link
  const searchParams = redirectTo === "" ? "" : new URLSearchParams([["redirectTo", safeRedirect(redirectTo)]])

  // check data if action is next
  if (action === 'next') {

    // get user type
    const userType = session.get("user-type")?.userType
    // get existing user data
    const userData = { name: data?.name, email: data?.email, document: { is: { value: data.cpf ?? data.passport } } }
    const user = await getExistingUser(userData)

    try {
      checkUserInputData([
        { key: "email", value: data.email, errorMessages: { undefined: "E-mail is required", invalid: "Invalid e-mail", existingUser: "E-mail already taken" }, valuesToCompare: [user?.email], dontValidate: data.email === undefined ? true : false },
        { key: "password", value: data.password, errorMessages: { undefined: "Password is required", invalid: "Invalid password", passwordLowerCase: "Password needs at least one lower case character", passwordUppercase: "Password needs at least one upper case character", passwordLength: "Password needs to be at least 8 characters long" }, dontValidate: data.password === undefined ? true : false },
        { key: "confirmPassword", value: data.confirmPassword, errorMessages: { undefined: "Password is required", invalid: "Passwords don't match" }, valuesToCompare: [data.password], dontValidate: data.confirmPassword === undefined ? true : false },

        { key: "name", value: data.name, errorMessages: { undefined: "Name is required", invalid: "Invalid name", existingUser: "Name already taken" }, valuesToCompare: [user?.name], dontValidate: data.name === undefined ? true : false },
        { key: "cpf", value: data.cpf, errorMessages: { undefined: "Cpf is required", invalid: "Invalid cpf", existingUser: "Cpf already taken" }, valuesToCompare: [user?.document?.value], dontValidate: data.cpf === undefined ? true : false },
        { key: "passport", value: data.passport, errorMessages: { undefined: "Passport number is required", invalid: "Invalid passport number", existingUser: "Passport number already taken" }, valuesToCompare: [user?.document?.value], dontValidate: data.passport === undefined ? true : false },
        { key: "birthDate", value: data.birthDate, errorMessages: { undefined: "Birth date is required", invalid: "Invalid birth date" }, dontValidate: data.birthDate === undefined ? true : false },
        { key: "phoneNumber", value: data.phoneNumber, errorMessages: { undefined: "Phone number is required", invalid: "Invalid phone number" }, dontValidate: data.phoneNumber === undefined ? true : false },

        { key: "language", value: data.language, errorMessages: { undefined: "At least one language required" }, dontValidate: (step != 6 || userType !== "delegate") },
        { key: "emergencyContactName", value: data.emergencyContactName, errorMessages: { undefined: "Name is required", invalid: "Invalid name" }, dontValidate: (step != 6 || userType !== "delegate") },
        { key: "emergencyContactPhoneNumber", value: data.emergencyContactPhoneNumber, errorMessages: { undefined: "Phone number is required", invalid: "Invalid phone number" }, dontValidate: (step != 6 || userType !== "delegate") },
      ])
    } catch (error) {
      error = qs.parse(error.message)
      return json(
        { errors: { [error.key]: error.msg } },
        { status: 400 }
      );
    }

    if (step == 7) {
      // if last step create the user
      let userData = {
        ...session.get("user-data-2"),
        ...session.get("user-data-3"),
        ...session.get("user-data-4"),
        ...session.get("user-data-6"),
        ...session.get("user-type"),
      }

      userData = await formatUserData(userData)

      const user = await createUser(userData)

      return createUserSession({
        request,
        userId: user.id,
        redirectTo: redirectTo ? safeRedirect(redirectTo) : `/join/delegation?${searchParams}`,
      });
    }
  }

  // save next step to the cookie
  const nextStep = userType ? 6 : Number(step) + (action === 'next' ? 1 : -1)
  session.set('current-step', { step: nextStep })
  // save the current page data
  console.log(data)
  session.set(`user-data-${step}`, data)
  // save new usertype if it is being defined
  if (userType) session.set('user-type', { userType: userType })

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
  if (step === 7) {
    const data = {
      ...session.get("user-data-2"),
      ...session.get("user-data-3"),
      ...session.get("user-data-4"),
      ...session.get("user-data-6"),
    }
    return json({ data, step, userType })
  } else if (step === 4) {
    const data = {
      ...session.get(`user-data-2`),
      ...session.get(`user-data-4`),
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
  const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(false)

  useEffect(() => {
    transition.state === 'idle' && setIsNextButtonClicked(false)
  }, [transition])

  const actionData = useActionData()
  let { userType, step, data } = useLoaderData()
  if (!step) step = 1

  return (
    <S.SubscriptionForm noValidate method='post'>
      <S.TitleBox>
        <S.Title>
          FAMUN 2023
        </S.Title>

        <S.AuxDiv>
          <S.ArrowIconBox />

          <S.SubTitle>
            Inscrição
          </S.SubTitle>
        </S.AuxDiv>
      </S.TitleBox>

      <input type="hidden" name="step" value={step} />
      <input type="hidden" name="redirectTo" value={redirectTo} />

      <S.Container>
        {step === 1 && <TermsAndConditions setIsNextButtonDisabled={setIsNextButtonDisabled} />}
        {step === 2 && <Nacionality data={data} />}
        {step === 3 && <CreateUser data={data} actionData={actionData} />}
        {step === 4 && <UserData data={data} actionData={actionData} />}
        {step === 5 && <UserType data={data} actionData={actionData} />}
        {step === 6 && (userType === "advisor" ?
          <AdvisorData data={data} actionData={actionData} /> : <DelegateData data={data} actionData={actionData} />)
        }
        {step === 7 && <ConfirmData data={data} userType={userType} />}
      </S.Container>

      <S.ControlButtonsContainer>
        {step !== 5 &&
          <S.ControlButton
            name="action"
            value="next"
            type="submit"
            disabled={isNextButtonDisabled}
            onClick={() => setIsNextButtonClicked(true)}
          >
            {step === 7 ? 'Cadastrar' : 'Próximo'}
            {transition.state !== 'idle' && isNextButtonClicked && <Spinner dim={18} />}
          </S.ControlButton>
        }

        {step > 2 &&
          <S.ControlButton
            name="action"
            value="previous"
            type="submit"
            prev
          >
            Voltar
          </S.ControlButton>
        }
      </S.ControlButtonsContainer>
    </S.SubscriptionForm>
  )
}

export default user
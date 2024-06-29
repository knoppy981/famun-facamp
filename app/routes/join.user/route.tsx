import React from 'react'
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import { Form, useActionData, useLoaderData, useNavigation, useSearchParams } from '@remix-run/react'
import qs, { ParsedQs } from "qs"

import { sessionStorage, createUserSession, getSession, getUserId } from '~/session.server'
import { createUserSchema, userStepValidation } from '~/schemas'
import { createUser, formatUserData, getExistingUser } from '~/models/user.server'
import { safeRedirect } from '~/utils'
import { getCorrectErrorMessage } from '~/utils/error'
import { useButtonState } from './hooks/useButtonState'

import Button from '~/components/button'
import TermsAndConditions from './steps/termsAndConditions'
import Nacionality from './steps/nacionality'
import CreateUser from './steps/createUser'
import UserData from './steps/userData'
import UserType from './steps/userType'
import AdvisorData from './steps/advisorData'
import DelegateData from './steps/delegateData'
import ConfirmData from './steps/confirmData'
import ParticipationMethod from './steps/participationMethod'
import { getCouncils } from '~/models/configuration.server'
import { sendEmail } from '~/nodemailer.server'
import { createUserEmail } from '~/lib/emails'

interface ExtendedParsedQs extends ParsedQs {
  redirectTo: string;
  step: string;
  action: string;
}

const LAST_STEP = 8

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await getSession(request)
  const text = await request.text()

  const { redirectTo, step, action, ...data } = qs.parse(text) as ExtendedParsedQs
  const searchParams = redirectTo === "" ? "" : new URLSearchParams([["redirectTo", safeRedirect(redirectTo)]])

  if (data.userType) session.set('user-type', { userType: data.userType })
  if (data.participationMethod) session.set('user-participationMethod', { participationMethod: data.participationMethod })

  if (action === 'next') {
    try {
      await userStepValidation(Number(step), data)
      if (Number(step) === 4 || Number(step) === 5) await getExistingUser({
        name: data.name === "" ? undefined : data.name,
        email: data.email === "" ? undefined : data.email,
        cpf: data.cpf === "" ? undefined : data.cpf,
        rg: data.rg === "" ? undefined : data.rg,
        passport: data.passport === "" ? undefined : data.passport,
      })
    } catch (error: any) {
      console.log(error)
      const [label, msg] = getCorrectErrorMessage(error)
      return json(
        { errors: { [label]: msg } },
        { status: 400 }
      );
    }

    if (Number(step) === LAST_STEP) {
      let userData = {
        ...session.get("user-data-3"),
        ...session.get("user-data-4"),
        ...session.get("user-data-5"),
        ...session.get("user-data-6"),
        ...session.get("user-data-7"),
        ...session.get("user-type"),
        ...session.get("user-participationMethod"),
      }

      userData = await formatUserData({
        data: userData,
        participationMethod: userData.participationMethod,
        userType: userData.userType
      })

      let user

      try {
        await createUserSchema.validateAsync(userData)
        user = await createUser(userData)
        const info = await sendEmail({
          to: user.email,
          subject: `Bem-vindo(a) ao FAMUN ${new Date().getFullYear()}!`,
          html: createUserEmail(user)
        })
      } catch (error) {
        console.log(error)
        return json(
          { errors: error },
          { status: 400 }
        );
      }

      return createUserSession({
        request,
        userId: user.id,
        redirectTo: redirectTo ? safeRedirect(redirectTo) : `/join/delegation?${searchParams}`,
      });
    }
  }

  const nextStep = Number(step) + (action === 'next' ? 1 : -1)
  session.set('current-step', { step: nextStep })
  session.set(`user-data-${step}`, data)

  return redirect(`/join/user?${searchParams}`, {
    headers: {
      'Set-cookie': await sessionStorage.commitSession(session),
    },
  })
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request)
  if (userId) return redirect("/")

  const session = await getSession(request)

  const { termsAndConditions, userType, step, participationMethod }: { termsAndConditions: string, userType: string, step: number, participationMethod: string } = {
    ...session.get("user-data-1"),
    ...session.get("current-step"),
    ...session.get("user-type"),
    ...session.get("user-participationMethod"),
  }

  let data

  switch (step) {
    case LAST_STEP:
      data = {
        ...session.get("user-data-3"),
        ...session.get("user-data-4"),
        ...session.get("user-data-5"),
        ...session.get("user-data-7"),
      } ?? {}
      return json({ data, step, userType, termsAndConditions, participationMethod })
    case 5:
      data = {
        ...session.get(`user-data-3`),
        ...session.get(`user-data-5`),
      } ?? {}
      return json({ data, step, userType, termsAndConditions, participationMethod })
    case 7:
      const councils = await getCouncils(participationMethod as "Escola" | "Universidade")
      data = {
        ...session.get(`user-data-${step}`),
        councils
      } ?? {}
      return json({ data, step, userType, termsAndConditions, participationMethod })
    default:
      data = session.get(`user-data-${step}`) ?? {}
      return json({ data, step, userType, termsAndConditions, participationMethod })
  }
}

const JoinUser = () => {
  const [searchParams] = useSearchParams();
  const actionData = useActionData<typeof action>()
  let { userType, step, data, termsAndConditions, participationMethod } = useLoaderData<typeof loader>()
  if (!step) step = 1
  const redirectTo = searchParams.get("redirectTo") || "";
  const transition = useNavigation()
  const [buttonLabel, isButtonDisabled, setIsButtonDisabled, handleButtonPress, buttonSpinner] = useButtonState(
    step, termsAndConditions, transition)


  return (
    <Form className='auth-container' noValidate method='post'>
      <h1 className='auth-title'>
        FAMUN {new Date().getFullYear()}
      </h1>

      <input type="hidden" name="step" value={step} />
      <input type="hidden" name="redirectTo" value={redirectTo} />

      <div className='join-wrapper'>
        {step === 1 && <TermsAndConditions setIsButtonDisabled={setIsButtonDisabled} />}
        {step === 2 && <ParticipationMethod />}
        {step === 3 && <Nacionality data={data} actionData={actionData} />}
        {step === 4 && <CreateUser data={data} actionData={actionData} />}
        {step === 5 && <UserData data={data} actionData={actionData} />}
        {step === 6 && <UserType />}
        {step === 7 && (userType === "advisor" ?
          <AdvisorData data={data} actionData={actionData} /> :
          <DelegateData data={data} actionData={actionData} participationMethod={participationMethod} />)
        }
        {step === 8 && <ConfirmData data={data} userType={userType} />}
      </div>

      <div className='join-buttons-container' style={{ pointerEvents: transition.state === 'idle' ? 'auto' : 'none' }}>
        {step !== 6 && step !== 2 &&
          <Button
            className={`primary-button-box ${isButtonDisabled ? "transparent" : ""}`}
            name="action"
            value="next"
            type="submit"
            isDisabled={isButtonDisabled}
            onPress={handleButtonPress}
          >
            {buttonLabel} {buttonSpinner}
          </Button>
        }

        {step > 2 &&
          <Button
            className='primary-button-box transparent'
            name="action"
            value="previous"
            type="submit"
          >
            Voltar
          </Button>
        }
      </div>
    </Form>
  )
}

export default JoinUser

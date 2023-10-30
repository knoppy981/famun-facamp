import { useActionData, useLoaderData, useSearchParams, useTransition } from '@remix-run/react'
import { json, redirect } from '@remix-run/node'
import qs from 'qs'

import { sessionStorage, getSession, createUserSession, getUserId, logout } from "~/session.server";
import { getCorrectErrorMessage, safeRedirect } from "~/utils";
import { createUser, formatUserData, getExistingUser } from '~/models/user.server';
import { userStepValidation } from '~/schemas/steps/user';
import { prismaUserSchema } from '~/schemas';

import * as S from '~/styled-components/join'
import DefaultButtonBox from '~/styled-components/components/buttonBox/default';
import Button from '~/styled-components/components/button';
import Spinner from '~/styled-components/components/spinner';
import AdvisorData from "~/styled-components/join/user/advisordata"
import ConfirmData from "~/styled-components/join/user/confirmdata"
import CreateUser from "~/styled-components/join/user/createuser"
import DelegateData from "~/styled-components/join/user/delegatedata"
import Nacionality from "~/styled-components/join/user/nacionality"
import UserData from "~/styled-components/join/user/userdata"
import UserType from "~/styled-components/join/user/usertype"
import TermsAndConditions from '~/styled-components/join/user/termsAndConditions';
import { FiChevronRight } from 'react-icons/fi';

export const action = async ({ request }) => {
  const text = await request.text()
  const session = await getSession(request)
  const { redirectTo, step, action, ...data } = qs.parse(text)
  const searchParams = redirectTo === "" ? "" : new URLSearchParams([["redirectTo", safeRedirect(redirectTo)]])

  if (data.userType) session.set('user-type', { userType: data.userType })

  if (action === 'next') {
    try {
      await userStepValidation(Number(step), data)
      await getExistingUser({
        name: data.name ?? "",
        email: data.email ?? "",
        document: { is: { value: data.cpf ?? data.passport ?? "" } }
      })
    } catch (error) {
      const [label, msg] = getCorrectErrorMessage(error)
      return json(
        { errors: { [label]: msg } },
        { status: 400 }
      );
    }

    if (step == 7) {
      let userData = {
        ...session.get("user-data-2"),
        ...session.get("user-data-3"),
        ...session.get("user-data-4"),
        ...session.get("user-data-5"),
        ...session.get("user-data-6"),
        ...session.get("user-type"),
      }

      userData = await formatUserData({
        data: userData,
        childrenModification: "create",
        userType: userData.userType
      })

      let user

      try {
        await prismaUserSchema.validateAsync(userData)
        user = await createUser(userData)
      } catch (e) {
        return json(
          { errors: e },
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

export const loader = async ({ request }) => {
  const userId = await getUserId(request)
  if (userId) return redirect("/")

  const session = await getSession(request)

  const { termsAndConditions, userType, step } = {
    ...session.get("user-data-1"),
    ...session.get("current-step"),
    ...session.get("user-type"),
  }
  if (step === 7) {
    const data = {
      ...session.get("user-data-2"),
      ...session.get("user-data-3"),
      ...session.get("user-data-4"),
      ...session.get("user-data-6"),
    } ?? {}
    return json({ data, step, userType, termsAndConditions })
  } else if (step === 4) {
    const data = {
      ...session.get(`user-data-2`),
      ...session.get(`user-data-4`),
    } ?? {}
    return json({ data, step, userType, termsAndConditions })
  } else {
    const data = session.get(`user-data-${step}`) ?? {}
    return json({ data, step, userType, termsAndConditions })
  }
}

const user = () => {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "";
  const transition = useTransition()
  const actionData = useActionData()
  let { userType, step, data, termsAndConditions } = useLoaderData()
  if (!step) step = 1
  const [buttonLabel, isButtonDisabled, setIsButtonDisabled, handleButtonPress, buttonSpinner] = useButtonState(
    step, termsAndConditions, transition)

  return (
    <S.SubscriptionForm noValidate method='post'>
      <S.TitleBox>
        <S.Title>
          FAMUN 2023
        </S.Title>

        <FiChevronRight size={25} />

        <S.SubTitle>
          Delegação
        </S.SubTitle>
      </S.TitleBox>

      <input type="hidden" name="step" value={step} />
      <input type="hidden" name="redirectTo" value={redirectTo} />

      <S.Container>
        {step === 1 && <TermsAndConditions setIsButtonDisabled={setIsButtonDisabled} />}
        {step === 2 && <Nacionality data={data} actionData={actionData} />}
        {step === 3 && <CreateUser data={data} actionData={actionData} />}
        {step === 4 && <UserData data={data} actionData={actionData} />}
        {step === 5 && <UserType data={data} actionData={actionData} />}
        {step === 6 && (userType === "advisor" ?
          <AdvisorData data={data} actionData={actionData} /> :
          <DelegateData data={data} actionData={actionData} />)
        }
        {step === 7 && <ConfirmData data={data} userType={userType} />}
      </S.Container>

      <S.ControlButtonsContainer style={{ pointerEvents: transition.state === 'idle' ? 'auto' : 'none' }}>
        {step !== 5 &&
          <DefaultButtonBox isDisabled={isButtonDisabled}>
            <Button
              name="action"
              value="next"
              type="submit"
              isDisabled={isButtonDisabled}
              onPress={handleButtonPress}
            >
              {buttonLabel} {buttonSpinner}
            </Button>
          </DefaultButtonBox>
        }

        {step > 2 &&
          <DefaultButtonBox whiteBackground>
            <Button
              name="action"
              value="previous"
              type="submit"
            >
              Voltar
            </Button>
          </DefaultButtonBox>
        }
      </S.ControlButtonsContainer>
    </S.SubscriptionForm>
  )
}

function useButtonState(step, termsAndConditions, transition) {
  const [buttonLabel, setButtonLabel] = React.useState("Próximo")
  const [buttonSpinner, setButtonSpinner] = React.useState(null)
  const [isButtonClicked, setIsButtonClicked] = React.useState(false)
  const [isButtonDisabled, setIsButtonDisabled] = React.useState(termsAndConditions !== "on")

  const handleButtonPress = () => {
    setIsButtonClicked(true)
  }

  React.useEffect(() => {
    setButtonLabel(step === 7 ? 'Cadastrar' : 'Próximo')
    setIsButtonClicked(transition.state === 'idle' ? false : isButtonClicked)
    setButtonSpinner(transition.state !== 'idle' && isButtonClicked ?
      <Spinner dim={18} /> :
      null
    )
  }, [step, transition])

  return [buttonLabel, isButtonDisabled, setIsButtonDisabled, handleButtonPress, buttonSpinner]
}

export default user
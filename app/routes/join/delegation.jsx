import { useRef, useState, useEffect } from "react";
import { redirect, json } from "@remix-run/node";
import { useSearchParams, useFetcher, useLoaderData, useActionData, useTransition } from "@remix-run/react";
import qs from "qs"

import { createUserSession, sessionStorage, getSession, requireUserId } from "~/session.server";
import { joinDelegation, createDelegation, generateDelegationInviteLink } from "~/models/delegation.server";
import { safeRedirect, checkUserInputData, generateString } from "~/utils";

import * as S from '~/styled-components/join'

import JoinMethod from "~/styled-components/join/delegation/joinmethod"
import JoinDelegation from "~/styled-components/join/delegation/joindelegation"
import CreateDelegation from "~/styled-components/join/delegation/createdelegation"
import DelegationAddress from "~/styled-components/join/delegation/delegationaddress"
import ConfirmDelegation from "~/styled-components/join/delegation/confirmdelegation"
import Spinner from "~/styled-components/components/spinner";


export const action = async ({ request }) => {
  const text = await request.text()
  const session = await getSession(request)
  const { redirectTo, step, action, joinType, ...data } = qs.parse(text)

  if (action === "next") {
    if (data.delegationCode) {
      // join delegation
      const userId = await requireUserId(request)
      let delegation

      try {
        delegation = await joinDelegation({ code: data.delegationCode, userId: userId })
      } catch (e) {
        console.log(e)
        return json(
          { errors: { joinDelegation: "Ocorreu algum erro inesperado, por favor atualize a página e tente novamente" } },
          { status: 404 }
        )
      }

      return createUserSession({
        request,
        userId: userId,
        delegationId: delegation.id,
        redirectTo: redirectTo ? safeRedirect(redirectTo) : `/dashboard/home`,
      });
    }

    try {
      checkUserInputData([
        { key: "schoolName", value: data.schoolName, errorMessages: { undefined: "School / University name is required", invalid: "Invalid name", existingUser: "School / University already registered" }, dontValidate: data.schoolName === undefined ? true : false },
        { key: "schoolPhoneNumber", value: data.schoolPhoneNumber, errorMessages: { undefined: "Phone number is required", invalid: "Invalid phone number" }, dontValidate: data.schoolPhoneNumber === undefined ? true : false },

        { key: "address", value: data.address, errorMessages: { undefined: "Address is required", invalid: "Invalid address" }, dontValidate: data.address === undefined ? true : false },
        { key: "country", value: data.country, errorMessages: { undefined: "Address is required", invalid: "Invalid address" }, dontValidate: data.country === undefined ? true : false },
        { key: "postalCode", value: data.postalCode, errorMessages: { undefined: "Postal code is required", invalid: "Invalid postal code" }, auxValue: data?.country, dontValidate: data.postalCode === undefined ? true : false },
        { key: "state", value: data.state, errorMessages: { undefined: "State is required", invalid: "Invalid state" }, dontValidate: data.state === undefined ? true : false },
        { key: "city", value: data.city, errorMessages: { undefined: "City is required", invalid: "Invalid city" }, dontValidate: data.city === undefined ? true : false },
        { key: "neighborhood", value: data.neighborhood, errorMessages: { undefined: "Neighborhood is required", invalid: "Invalid Neighborhood" }, dontValidate: data.neighborhood === undefined ? true : false },
      ])
    } catch (error) {
      error = qs.parse(error.message)
      return json(
        { errors: { [error.key]: error.msg } },
        { status: 400 }
      );
    }

    if (step == 4) {
      const userId = await requireUserId(request)
      const code = generateString(6)

      const delegationData = {
        ...session.get("delegation-data-2"),
        ...session.get("delegation-data-3"),
        code: code,
        inviteLink: await generateDelegationInviteLink(code),
        userId: userId,
      }
      const delegation = await createDelegation(delegationData)

      return createUserSession({
        request,
        userId: userId,
        delegationId: delegation.id,
        remember: false,
        redirectTo: redirectTo ? safeRedirect(redirectTo) : `/dashboard/home`,
      });
    }
  }

  // next step
  let nextStep = Number(step) + (action === 'next' ? 1 : -1)
  // if setting join type mvoe to second step
  if (joinType) {
    session.set('join-type', { joinType: joinType })
    nextStep = 2
  }
  // if you are joining you can only be aat step 1 or 2
  if (session.get("join-type")?.joinType === "join" && step > 2) nextStep = 1
  // set the data for the current step
  if (session.get("join-type")?.joinType === "create") session.set(`delegation-data-${step}`, data)
  // set next step
  session.set('delegation-current-step', { step: nextStep })

  const searchParams = redirectTo === "" ? "" : new URLSearchParams([["redirectTo", safeRedirect(redirectTo)]])
  return redirect(`/join/delegation?${searchParams}`, {
    headers: {
      'Set-cookie': await sessionStorage.commitSession(session),
    },
  })
}

export const loader = async ({ request }) => {
  const session = await getSession(request)

  const { joinType, step } = {
    ...session.get("delegation-current-step"),
    ...session.get("join-type"),
  }

  if (step === 4) {
    const data = {
      ...session.get("delegation-data-2"),
      ...session.get("delegation-data-3"),
    }
    return json({ data, step, joinType })
  } else {
    const data = session.get(`delegation-data-${step}`) ?? {}
    return json({ data, step, joinType })
  }

}

const delegation = () => {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "";
  const transition = useTransition()
  const [isNextButtonClicked, setIsNextButtonClicked] = useState(false)

  useEffect(() => {
    transition.state === 'idle' && setIsNextButtonClicked(false)
  }, [transition])

  const actionData = useActionData()

  useEffect(() => {
    console.log(actionData)
  }, [actionData])
  let { data, step, joinType } = useLoaderData()
  if (!step) step = 1

  return (
    <S.SubscriptionForm type="submit" noValidate method='post' >
      <S.TitleBox>
        <S.Title>
          FAMUN 2023
        </S.Title>

        <S.AuxDiv>
          <S.ArrowIconBox />

          <S.SubTitle>
            Delegação
          </S.SubTitle>
        </S.AuxDiv>
      </S.TitleBox>

      <input type="hidden" name="step" value={step} />
      <input type="hidden" name="redirectTo" value={redirectTo} />

      <S.Container>
        {step === 1 && <JoinMethod />}
        {step === 2 && (joinType === "create" ?
          <CreateDelegation data={data} actionData={actionData} /> : <JoinDelegation data={data} actionData={actionData} />)
        }
        {step === 3 && joinType === "create" && <DelegationAddress data={data} actionData={actionData} />}
        {step === 4 && joinType === "create" && <ConfirmDelegation data={data} />}
      </S.Container>

      <S.ControlButtonsContainer>
        {step > 1 ?
          joinType === "create" ?
            <S.ControlButton name="action" value="next" type="submit" onClick={() => setIsNextButtonClicked(true)}> Próximo  {transition.state !== 'idle' && isNextButtonClicked && <Spinner dim={18} />} </S.ControlButton> : null : null
        }

        {step !== 1 && <S.ControlButton name="action" value="previous" type="submit" prev> Voltar </S.ControlButton>}
      </S.ControlButtonsContainer>
    </S.SubscriptionForm >
  )
}

export default delegation
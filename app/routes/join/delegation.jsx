import { useRef, useState, useEffect } from "react";
import { redirect, json } from "@remix-run/node";
import { useSearchParams, useFetcher, useLoaderData, useActionData, useTransition } from "@remix-run/react";
import qs from "qs"

import { createUserSession, sessionStorage, getSession, requireUserId } from "~/session.server";
import { joinDelegation, createDelegation, generateDelegationInviteLink, formatDelegationData, getExistingDelegation } from "~/models/delegation.server";
import { safeRedirect, generateString, getCorrectErrorMessage } from "~/utils";
import { delegationStepValidation, delegationSchema } from "~/schemas";

import * as S from '~/styled-components/join'
import DefaultButtonBox from '~/styled-components/components/buttonBox/default';
import Button from '~/styled-components/components/button';
import Spinner from "~/styled-components/components/spinner";

import JoinMethod from "~/styled-components/join/delegation/joinmethod"
import JoinDelegation from "~/styled-components/join/delegation/joindelegation"
import CreateDelegation from "~/styled-components/join/delegation/createdelegation"
import DelegationAddress from "~/styled-components/join/delegation/delegationaddress"
import ConfirmDelegation from "~/styled-components/join/delegation/confirmdelegation"
import { prismaDelegationSchema } from "~/schemas/objects/delegation";


export const action = async ({ request }) => {
  const text = await request.text()
  const session = await getSession(request)
  const { redirectTo, step, action, ...data } = qs.parse(text)
  const searchParams = redirectTo === "" ? "" : new URLSearchParams([["redirectTo", safeRedirect(redirectTo)]])

  if (data.joinMethod) session.set('join-method', { joinMethod: data.joinMethod })

  if (action === "next") {
    if (data.delegationCode) {
      // join delegation
      let userId
      let delegation
      try {
        userId = await requireUserId(request)
        delegation = await joinDelegation({ code: data.delegationCode, userId: userId })
      } catch (e) {
        return json(
          { errors: e },
          { status: 400 }
        );
      }
      return createUserSession({
        request,
        userId: userId,
        delegationId: delegation.id,
        redirectTo: redirectTo ? safeRedirect(redirectTo) : `/dashboard/home`,
      });
    }

    try {
      await delegationStepValidation(Number(step), data)
      await getExistingDelegation({
        school: data.school ?? ""
      })
    } catch (error) {
      console.dir(error, { depth: null })
      const [label, msg] = getCorrectErrorMessage(error)
      return json(
        { errors: { [label]: msg } },
        { status: 400 }
      );
    }

    if (step == 4) {
      // create delegation
      const userId = await requireUserId(request)
      let delegationData = {
        ...session.get("delegation-data-2"),
        ...session.get("delegation-data-3"),
        userId: userId,
        code: generateString(6),
      }

      delegationData = await formatDelegationData({ data: delegationData })
      console.dir(delegationData, { depth: null })
      let delegation

      try {
        await prismaDelegationSchema.validateAsync(delegationData)
        delegation = await createDelegation(delegationData, userId)
      } catch (error) {
        console.dir(error, { depth: null })
        return json(
          error,
          { status: 400 }
        );
      }

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
  if (session.get("join-method")?.joinMethod === "join" && step > 2) nextStep = 1
  if (session.get("join-method")?.joinMethod === "create") session.set(`delegation-data-${step}`, data)
  session.set('delegation-current-step', { step: nextStep })

  return redirect(`/join/delegation?${searchParams}`, {
    headers: {
      'Set-cookie': await sessionStorage.commitSession(session),
    },
  })
}

export const loader = async ({ request }) => {
  const session = await getSession(request)
  const userId = await requireUserId(request)

  const { joinMethod, step } = {
    ...session.get("delegation-current-step"),
    ...session.get("join-method"),
  }

  if (step === 4) {
    const data = {
      ...session.get("delegation-data-2"),
      ...session.get("delegation-data-3"),
    }
    return json({ data, step, joinMethod })
  } else {
    const data = session.get(`delegation-data-${step}`) ?? {}
    return json({ data, step, joinMethod })
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

  let { data, step, joinMethod } = useLoaderData()
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
        {step === 2 && (joinMethod === "create" ?
          <CreateDelegation data={data} actionData={actionData} /> :
          <JoinDelegation
            data={data}
            actionData={actionData}
            transition={transition}
            isNextButtonClicked={isNextButtonClicked}
            setIsNextButtonClicked={setIsNextButtonClicked}
          />
        )}
        {step === 3 && joinMethod === "create" && <DelegationAddress data={data} actionData={actionData} />}
        {step === 4 && joinMethod === "create" && <ConfirmDelegation data={data} />}
      </S.Container>

      <S.ControlButtonsContainer>
        {step > 1 && joinMethod === "create" &&
          <DefaultButtonBox>
            <Button
              name="action"
              value="next"
              type="submit"
              onPress={() => setIsNextButtonClicked(true)}
            >
              Próximo  {transition.state !== 'idle' && isNextButtonClicked && <Spinner dim={18} />}
            </Button>
          </DefaultButtonBox>

        }

        {step !== 1 &&
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
    </S.SubscriptionForm >
  )
}

export default delegation
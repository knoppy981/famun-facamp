import React from "react";
import { redirect, json, ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useSearchParams, useLoaderData, useActionData, Form, useNavigation } from "@remix-run/react";
import qs, { ParsedQs } from "qs"

import { createUserSession, sessionStorage, getSession, requireUser } from "~/session.server";
import { joinDelegation, createDelegation } from "~/models/delegation.server";
import { safeRedirect, useUser } from "~/utils";
import { getCorrectErrorMessage } from "~/utils/error";
import { createDelegationSchema } from "~/schemas";

import Button from "~/components/button";
import JoinMethod from "./steps/joinMethod";
import JoinDelegation from "./steps/joinDelegation"
import CreateDelegation from "./steps/createDelegation"
import ConfirmData from "./steps/confirmData"
import { useButtonState } from "./hooks/useButtonState";
import { sendEmail } from "~/nodemailer.server";
import { createDelegationEmail } from "~/lib/emails";
import { UserType } from "~/models/user.server";
import { verifyJoinAuthentication } from "../join/utils/verifyJoinAuthentication";
import { getDelegationData } from "./utils/getDelegationData";
import { getSessionData } from "./utils/getSessionData";
import { verifyStepData } from "./utils/verifyStepData";

interface ExtendedParsedQs extends ParsedQs {
  redirectTo: string;
  step: string;
  action: string;
}

const LAST_STEP = 3

export const action = async ({ request }: ActionFunctionArgs) => {
  const text = await request.text()
  const session = await getSession(request)
  const { redirectTo, step, action, ...data } = qs.parse(text) as ExtendedParsedQs
  const searchParams = redirectTo === "" ? new URLSearchParams() : new URLSearchParams([["redirectTo", safeRedirect(redirectTo)]])

  if (data.joinMethod) session.set('join-method', { joinMethod: data.joinMethod })

  if (action === "next") {
    if (data.delegationCode) {
      // join delegation
      const user = await requireUser(request)
      await verifyJoinAuthentication(user.participationMethod, session, searchParams)
      let delegation

      try {
        delegation = await joinDelegation({ code: data.delegationCode as string, userId: user.id })
      } catch (e) {
        return json(
          { errors: e },
          { status: 400 }
        );
      }
      return createUserSession({
        request,
        userId: user.id,
        delegationId: delegation.id,
        redirectTo: redirectTo ? safeRedirect(redirectTo) : `/dashboard/home`,
      });
    }

    try { await verifyStepData(data, Number(step)) } catch (error) {
      console.dir(error, { depth: null })
      const [label, msg] = getCorrectErrorMessage(error)
      return json(
        { errors: { [label]: msg } },
        { status: 400 }
      );
    }

    if (Number(step) === LAST_STEP) {
      // create delegation
      const user = await requireUser(request)
      await verifyJoinAuthentication(user.participationMethod, session, searchParams)
      const formattedDelegationData = await getDelegationData(session, user)
      let delegation

      try {
        await createDelegationSchema.validateAsync(formattedDelegationData)
        delegation = await createDelegation(formattedDelegationData, user.id)
        await sendEmail({
          to: user.email,
          subject: `FAMUN ${new Date().getFullYear()}: Sua delegação foi criada com sucesso!`,
          html: createDelegationEmail(delegation, user as UserType)
        })
      } catch (error) {
        console.dir(error, { depth: null })
        return json(
          error,
          { status: 400 }
        );
      }

      return createUserSession({
        request,
        userId: user.id,
        delegationId: delegation.id,
        remember: false,
        redirectTo: redirectTo ? safeRedirect(redirectTo) : `/dashboard/home`,
      });
    }
  }

  // next step
  let nextStep = Number(step) + (action === 'next' ? 1 : -1)
  session.set('delegation-current-step', { step: nextStep })
  if (session.get("join-method")?.joinMethod === "join" && Number(step) > 2) nextStep = 1
  if (session.get("join-method")?.joinMethod === "create") session.set(`delegation-data-${step}`, data)

  return redirect(`/join/delegation?${searchParams}`, {
    headers: {
      'Set-cookie': await sessionStorage.commitSession(session),
    },
  })
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireUser(request)
  if (user.delegationId) return redirect('/')
  const session = await getSession(request)
  const data = await getSessionData(LAST_STEP, session)

  return json(data)
}

const delegation = () => {
  const user = useUser()
  const [searchParams] = useSearchParams();
  const actionData = useActionData<typeof action>()
  let { data, step, joinMethod } = useLoaderData<typeof loader>()
  if (!step) step = 1
  const redirectTo = searchParams.get("redirectTo") || "";
  const transition = useNavigation()
  const [buttonLabel, isButtonDisabled, setIsButtonDisabled, handleButtonPress, buttonSpinner] = useButtonState(
    step, transition)

  return (
    <Form autoComplete="off" className='auth-container' noValidate method='post' >
      <h1 className='auth-title'>
        FAMUN {new Date().getFullYear()}
      </h1>

      <input type="hidden" name="step" value={step} />
      <input type="hidden" name="redirectTo" value={redirectTo} />

      <div className='join-wrapper'>

        {step === 1 && <JoinMethod />}
        {step === 2 && (joinMethod === "create" ?
          <CreateDelegation data={data} actionData={actionData} user={user} /> :
          <JoinDelegation transition={transition} user={user} />
        )}
        {step === 3 && joinMethod === "create" && <ConfirmData data={data} />}
      </div>

      <div className='join-buttons-container' style={{ pointerEvents: transition.state === 'idle' ? 'auto' : 'none' }}>
        {step > 1 && joinMethod === "create" &&
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

        {step !== 1 &&
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
    </Form >
  )
}

export default delegation
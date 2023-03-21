import { useRef, useState, useEffect } from "react";
import { redirect, json } from "@remix-run/node";
import { useSearchParams, useFetcher, useLoaderData, useActionData, useTransition } from "@remix-run/react";
import qs from "qs"

import { createUserSession, sessionStorage, getSession, requireUserId } from "~/session.server";
import { joinDelegation, createDelegation, generateDelegationInviteLink } from "~/models/delegation.server";
import { safeRedirect, checkStringWithNumbers, checkString, validatePhoneNumber, generateString } from "~/utils";

import * as S from '~/styled-components/join/delegation'

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

  console.log(step)

  let nextStep = Number(step) + (action === 'next' ? 1 : -1)

  if (joinType) {
    session.set('join-type', { joinType: joinType })
    nextStep = 2
  }

  if (session.get("join-type")?.joinType === "join" && step > 2) nextStep = 1

  if (action === "next") {
    if (data.delegationCode) {
      const userId = await requireUserId(request)
      const delegation = await joinDelegation({ code: data.delegationCode, userId: userId })
        .catch(() => {
          return json(
            { errors: { joinDelegation: "Não foi possível entrar na delegação" } },
            { status: 400 }
          )
        })

      return createUserSession({
        request,
        userId: userId,
        delegationId: delegation.id,
        redirectTo: safeRedirect(redirectTo ?? ""),
      });
    }

    if (data.schoolName?.length === 0)
      return json(
        { errors: { schoolName: "Preencha com o nome da sua escola / universidade" } },
        { status: 400 }
      );
    if (data.schoolName) {
      if (typeof data.schoolName !== "string" || !checkStringWithNumbers(data.schoolName))
        return json(
          { errors: { schoolName: "Nome de Escola / Universidade inválido" } },
          { status: 400 }
        );
    }

    if (data.schoolPhoneNumber?.length === 0)
      return json(
        { errors: { schoolPhoneNumber: "Preencha o número de telefone" } },
        { status: 400 }
      );
    if (data.schoolPhoneNumber) {
      if (typeof data.schoolPhoneNumber !== "string" || !validatePhoneNumber(data.schoolPhoneNumber))
        return json(
          { errors: { schoolPhoneNumber: "Número de telefone da Escola / Universidade inválido" } },
          { status: 400 }
        );
    }

    if (data.address?.length === 0)
      return json(
        { errors: { address: "Digite o endereço" } },
        { status: 400 }
      );
    if (data.address) {
      if (typeof data.address !== "string")
        return json(
          { errors: { address: "Endereço Inválido" } },
          { status: 400 }
        );
    }

    if (data.country?.length === 0)
      return json(
        { errors: { country: "Digite o país" } },
        { status: 400 }
      );
    if (data.country) {
      if (typeof data.country !== "string" || !checkString(data.country))
        return json(
          { errors: { country: "País Inválido" } },
          { status: 400 }
        );
    }

    if (data.cep?.length === 0)
      return json(
        { errors: { cep: "Digite o CEP" } },
        { status: 400 }
      );
    if (data.cep) {
      if (typeof data.cep !== "string")
        return json(
          { errors: { cep: "CEP Inválido" } },
          { status: 400 }
        );
    }

    if (data.state?.length === 0)
      return json(
        { errors: { state: "Digite o estado" } },
        { status: 400 }
      );
    if (data.state) {
      if (typeof data.state !== "string" || !checkString(data.state))
        return json(
          { errors: { state: "Estado inválido" } },
          { status: 400 }
        );
    }

    if (data.city?.length === 0)
      return json(
        { errors: { city: "Digite a cidade" } },
        { status: 400 }
      );
    if (data.city) {
      if (typeof data.city !== "string" || !checkString(data.city))
        return json(
          { errors: { city: "Cidade inválido" } },
          { status: 400 }
        );
    }

    if (data.neighborhood?.length === 0)
      return json(
        { errors: { neighborhood: "Digite o bairro" } },
        { status: 400 }
      );
    if (data.neighborhood) {
      if (typeof data.neighborhood !== "string" || !checkString(data.neighborhood))
        return json(
          { errors: { neighborhood: "Bairro inválido" } },
          { status: 400 }
        );
    }

    if (step == 4) {

      console.log('before user id')

      const userId = await requireUserId(request)
      const code = generateString(6)

      const delegationData = {
        ...session.get("delegation-data-2"),
        ...session.get("delegation-data-3"),
        code: code,
        inviteLink: await generateDelegationInviteLink(code),
        userId: userId,
      }

      console.log('creating delegation')

      const delegation = await createDelegation(delegationData)

      console.log(delegation)

      return createUserSession({
        request,
        userId: userId,
        delegationId: delegation.id,
        remember: false,
        redirectTo: redirectTo ? safeRedirect(redirectTo) : `/`,
      });
    }
  }

  if (session.get("join-type")?.joinType === "create") session.set(`delegation-data-${step}`, data)
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
    <S.StepsForm type="submit" noValidate method='post' >
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
    </S.StepsForm >
  )
}

export default delegation
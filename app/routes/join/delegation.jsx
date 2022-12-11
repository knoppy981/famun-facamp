import { useRef, useState, useEffect } from "react";
import { redirect, json } from "@remix-run/node";
import { useSearchParams, useFetcher, useLoaderData, useActionData } from "@remix-run/react";
import qs from "qs"

import { createUserSession, sessionStorage, getSession, requireUserId } from "~/session.server";
import { joinDelegation } from "~/models/delegation.server";
import { safeRedirect } from "~/utils";

import * as S from '~/styled-components/join/delegation'
import { FiSettings, FiHelpCircle, FiArrowLeft, FiCheck, FiX } from "react-icons/fi";
import AuthInputBox from "~/styled-components/components/inputs/authInput";


export const action = async ({ request }) => {
  const text = await request.text()
  const session = await getSession(request)
  const { redirectTo, step, action, joinType, delegationCode, ...data } = qs.parse(text)

  let nextStep = Number(step) + (action === 'next' ? 1 : -1)

  if (joinType) {
    session.set('join-type', { joinType: joinType })
    nextStep = 2
  }

  if (session.get("join-type")?.joinType === "join" && step > 2) nextStep = 1

  if (delegationCode) {
    const userId = await requireUserId(request)

    const delegation = await joinDelegation({ code: delegationCode, userId: userId })
      .catch((err) => {
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

  session.set(`delegation-data-${step}`, data)

  session.set('delegation-current-step', { step: nextStep })

  const searchParams = redirectTo === "" ? "" : new URLSearchParams([["redirectTo", safeRedirect(redirectTo)]])
  return redirect(`/join/delegation?${searchParams}`, {
    headers: {
      'set-cookie': await sessionStorage.commitSession(session),
    },
  })
}

export const loader = async ({ request }) => {
  const session = await getSession(request)

  const { joinType, step } = {
    ...session.get("delegation-current-step"),
    ...session.get("join-type"),
  }
  const data = session.get(`delegation-data-${step}`) ?? {}

  console.log(joinType)
  console.log(step)

  return json({ data, step, joinType })
}

const JoinMethod = () => {
  return (
    <>
      <S.StepTitle>
        Participe de uma delegação
      </S.StepTitle>

      <S.StepSubtitle>
        Crie uma delegação ou entre na delegação do seu grupo!
      </S.StepSubtitle>

      <S.StepButtonsContainer>
        <S.StepButton name="joinType" type="submit" value="create">
          Criar nova delegação
        </S.StepButton>

        <S.StepButton name="joinType" type="submit" value="join">
          Entrar em uma Delegação
        </S.StepButton>
      </S.StepButtonsContainer>
    </>
  )
}

const JoinDelegation = ({ data, actionData }) => {

  const inputRef = useRef(null)
  const [value, setValue] = useState("")
  const [label, setLabel] = useState("")
  const [valid, setValid] = useState(false)
  const searchDelegation = useFetcher()

  const handleChange = (event) => {
    setValue(event.target.value)
    if (inputRef.current.value.length === 6) {
      searchDelegation.submit(
        { delegationCode: event.target.value },
        { method: "post", action: "/api/delegationCode" }
      );
    }
  }

  useEffect(() => {
    setLabel(
      searchDelegation.state !== "idle" ?
        "Procurando..." : searchDelegation?.data?.delegation && inputRef.current.value.length === 6 ?
          "Delegação do " + searchDelegation?.data?.delegation.school : searchDelegation?.data?.errors ?
            searchDelegation?.data?.errors["delegation" || "code"] : "Exemplo : A1B2C3"
    )
    setValid((searchDelegation?.data?.delegation && inputRef.current.value.length === 6) ? true : false)
  }, [searchDelegation, value])

  return (
    <>
      <S.StepTitle>
        Entrar em uma delegação
      </S.StepTitle>

      <S.StepSubtitle>
        Digite o código da sua delegação abaixo ou peça um convite para o chefe da sua delegação
      </S.StepSubtitle>

      <S.JoinDelegationContainer>
        <S.JoinDelegationLabel>
          Código :
        </S.JoinDelegationLabel>

        <S.JoinDelegationInputBox>
          <S.JoinDelegationInput
            ref={inputRef}
            value={value}
            id="delegationCode"
            name="delegationCode"
            type="string"
            autoFocus={true}
            onChange={handleChange}
          />
          <S.JoinDelegationIcon color={searchDelegation?.data?.errors ? "#A7A7A7" : "green"}>
            {searchDelegation?.data?.errors ? <FiX /> : (searchDelegation?.data?.delegation && value.length === 6) ? <FiCheck /> : null}
          </S.JoinDelegationIcon>
        </S.JoinDelegationInputBox>

        <S.JoinDelegationButton type="submit" disabled={!valid}>
          Entrar
        </S.JoinDelegationButton>
      </S.JoinDelegationContainer>

      <S.joinDelegationStatus>
        {label}
      </S.joinDelegationStatus>
    </>
  )
}

const CreateDelegation = ({ data, actionData }) => {
  return (
    <>
      <S.StepTitle>
        Criar uma delegação
      </S.StepTitle>

      <S.InputContainer>
        <AuthInputBox
          name="schoolName"
          text="Nome da Escola / Universidade"
          type="text"
          value={data?.schoolName}
          err={actionData?.errors?.schoolName}
          autoFocus={true}
        />

        <AuthInputBox
          name="schoolPhoneNumber"
          text="Numero de Telefone da Escola / Universidade"
          type="text"
          value={data?.schoolPhoneNumber}
          err={actionData?.errors?.email}
        />

        <AuthInputBox
          name="participationMethod"
          text="Metodo de Participação da Delegação"
          type="text"
          value={data?.participationMethod}
          err={actionData?.errors?.participationMethod}
        />
      </S.InputContainer>
    </>
  )
}

const DelegationAddress = ({ data, actionData }) => {
  return (
    <>
      <S.StepTitle>
        Preencha o endereço da Escola / Universidade
      </S.StepTitle>

      <S.InputContainer>
        <AuthInputBox
          name="address"
          text="Endereço"
          type="text"
          value={data?.address}
          err={actionData?.errors?.address}
          autoFocus={true}
        />

        <S.SubInputContainer>
          <AuthInputBox
            name="country"
            text="País"
            type="text"
            value={data?.country}
            err={actionData?.errors?.country}
          />

          <AuthInputBox
            name="cep"
            text="CEP"
            type="text"
            value={data?.cep}
            err={actionData?.errors?.cep}
          />
        </S.SubInputContainer>

        <S.SubInputContainer>
          <AuthInputBox
            name="state"
            text="Estado"
            type="text"
            value={data?.state}
            err={actionData?.errors?.state}
          />

          <AuthInputBox
            name="city"
            text="Cidade"
            type="text"
            value={data?.city}
            err={actionData?.errors?.city}
          />
        </S.SubInputContainer>

        <S.SubInputContainer>
          <AuthInputBox
            name="neighborhood"
            text="Bairro"
            type="text"
            value={data?.neighborhood}
            err={actionData?.errors?.neighborhood}
          />
        </S.SubInputContainer>

      </S.InputContainer>
    </>
  )
}

const ConfirmDelegation = ({ data }) => {
  const dataArray = Object.entries(data)
  return (
    <>
      <S.StepTitle>
        Estamos quase lá!
      </S.StepTitle>

      <S.StepSubtitle>
        Confirme os dados abaixo para finalizar a inscrição da delegação da sua sua escola / universidade
      </S.StepSubtitle>

      <S.ConfirmList>
        <S.ConfirmColumn>
          {Array.from({ length: 3 }).map((item, index) => {
            return (
              <S.ConfirmItem>
                <S.ConfirmLabel>
                  {dataArray[index][0]}
                </S.ConfirmLabel>
                {dataArray[index][1]}
              </S.ConfirmItem>
            )
          })}
        </S.ConfirmColumn>

        <S.ConfirmColumn>
          {Array.from({ length: 3 }).map((item, index) => {
            return (
              <S.ConfirmItem>
                <S.ConfirmLabel>
                  {dataArray[index + 3][0]}
                </S.ConfirmLabel>
                {dataArray[index + 3][1]}
              </S.ConfirmItem>
            )
          })}
        </S.ConfirmColumn>

        <S.ConfirmColumn>
          {Array.from({ length: 3 }).map((item, index) => {
            return (
              <S.ConfirmItem>
                <S.ConfirmLabel>
                  {dataArray[index + 6][0]}
                </S.ConfirmLabel>
                {dataArray[index + 6][1]}
              </S.ConfirmItem>
            )
          })}
        </S.ConfirmColumn>
      </S.ConfirmList>
    </>
  )
}

const delegation = () => {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "";

  const actionData = useActionData()
  let { data, step, joinType } = useLoaderData()
  if (!step) step = 1

  return (
    <S.StepsForm type="submit" noValidate method='post' >
      <input type="hidden" name="step" value={step} />
      <input type="hidden" name="redirectTo" value={redirectTo} />

      {step === 1 && <JoinMethod />}
      {step === 2 && (joinType === "create" ? <CreateDelegation /> : <JoinDelegation data={data} actionData={actionData}/>)}

      <S.ControlButtonsContainer>
        {step !== 1 && <S.ControlButton name="action" value="previous" type="submit" prev> Voltar </S.ControlButton>}

        {step !== 1 && (step !== 2 && joinType !== "join") && <S.ControlButton name="action" value="next" type="submit"> Próximo </S.ControlButton>}
      </S.ControlButtonsContainer>
    </S.StepsForm >
  )
}

export default delegation
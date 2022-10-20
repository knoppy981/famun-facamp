import { useState, useRef, useEffect } from 'react'
import { useSubmit, useActionData, useTransition, useSearchParams } from '@remix-run/react'
import { json, redirect } from '@remix-run/node'

import { findDelegationCode, joinDelegation } from '~/models/delegation.server'
import { getDelegationId, createUserSession, getUserId } from '~/session.server'
import { safeRedirect } from '~/utils'

import * as S from '~/styled-components/auth/enter'
import img from '~/images/createteam.svg'

export async function action({ request }) {
  const userId = await getUserId(request)
  const formData = await request.formData()
  const code = formData.get("code")
  const button = formData.get("button")

  if (typeof code !== "string" || code.length !== 6) {
    return json(
      { errors: { code: "Invalid code" } },
      { status: 400 }
    );
  } else {
    const delegation = await findDelegationCode(code);
    if (!delegation) {
      return json(
        { errors: { delegation: "Delegation not found" } },
        { status: 400 }
      );
    } else if (button === "button") {
      const params = new URLSearchParams([["delegationCode", code]]);
      return redirect(`/auth/signup?${params}`);
    }
    return json({ delegation });
  }
}

const join = () => {

  const submit = useSubmit()
  const actionData = useActionData()
  const transition = useTransition()

  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get("redirectTo") ?? undefined

  const [inputFocus, setInputFocus] = useState(true)
  const inputRef = useRef(null)
  const [inputValue, setInputValue] = useState("")

  const [transitionState, setTransitionState] = useState("")

  useEffect(() => {
    setTransitionState(
      transition.state === "submitting" ?
        "Procurando..." : transition.state === "loading" ?
          "Procurando..." : actionData?.delegation && inputRef.current.value.length === 6 ?
            "Entrar!" : "Não encontrado"
    )
  }, [transition, inputValue])

  const handleChange = (event) => {
    if (inputRef.current.value.length === 6)
      submit(event.currentTarget, { replace: true })
  }

  return (
    <S.Wrapper>
      <S.Title>
        Entre na sua Delegação!
      </S.Title>
      <S.Subtitle>
        Digite o código ou peça um convite para o líder do seu grupo
      </S.Subtitle>
      <S.AuthForm
        method='post'
        noValidate
        onChange={handleChange}
      >
        <S.Label
          focus={inputFocus}
        >
          Código :
        </S.Label>
        <S.InputContainer
          focus={inputFocus}
        >
          <S.Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            id="code"
            name="code"
            type="string"
            autoFocus={true}
            onFocus={() => setInputFocus(true)}
            onBlur={() => {
              inputRef.current.value === '' || null ? setInputFocus(false) : null
            }}
          >
          </S.Input>
          {actionData?.errors && inputRef.current.value.length === 6 &&
            <S.Error>
              {actionData?.erros?.code}
            </S.Error>
          }
        </S.InputContainer>

        <input type="hidden" name="redirectTo" value={redirectTo} />

        <S.Button
          disabled={transitionState !== "Entrar!"}
          type="submit"
          name="button"
          value="button"
        >
          {transitionState}
        </S.Button>
      </S.AuthForm>

      <S.Image
        src={img}
      />

    </S.Wrapper>
  )
}

export default join
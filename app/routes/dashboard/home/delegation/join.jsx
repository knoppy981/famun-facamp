import { useState, useRef, useEffect } from 'react'
import { useSubmit, useActionData, useTransition, useSearchParams } from '@remix-run/react'
import { json, redirect } from '@remix-run/node'

import { findDelegationCode, joinDelegation } from '~/models/delegation.server'
import { getDelegationId, createUserSession, getUserId } from '~/session.server'
import { safeRedirect } from '~/utils'

import * as S from '~/styled-components/dashboard/home/delegation/join'
import img from '~/images/createteam.svg'

export async function action({ request }) {
  const userId = await getUserId(request)
  const formData = await request.formData()
  const code = formData.get("code")
  const button = formData.get("button")
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/");

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

      await joinDelegation(userId, delegation.id).catch((err) => {
        return json(
          { erros: { delegation: "unable to join delegation" } },
          { status: 400 }
        )
      })

      return createUserSession({
        request,
        delegationId: delegation.id,
        redirectTo,
      });
    }
    return json({ delegation });
  }
}

export async function loader({ request }) {
  const delegationId = await getDelegationId(request)
  if (delegationId !== undefined) return redirect("/dashboard/home/delegation")
  return json({})
}

const join = () => {

  const submit = useSubmit()
  const actionData = useActionData()
  const transition = useTransition()

  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get("redirectTo") ?? undefined

  const [inputFocus, setinputFocus] = useState(false)
  const inputRef = useRef(null)
  const [inputValue, setInputValue] = useState("")

  const [transitionState, setTransitionState] = useState("")

  useEffect(() => {
    setTransitionState(
      transition.state === "submitting" ?
        "Procurando..." : transition.state === "loading" ?
          "Waiting" : actionData?.delegation && inputRef.current.value.length === 6 ?
            "Found!" : "Not Found"
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
            onFocus={() => setinputFocus(true)}
            onBlur={() => {
              inputRef.current.value === '' || null ? setinputFocus(false) : null
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
          disabled={transitionState !== "Found!"}
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
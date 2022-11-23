import { useEffect } from 'react'
import { useActionData, useSearchParams, useTransition } from '@remix-run/react'
import { json, redirect } from '@remix-run/node';

import { getUserId, createUserSession } from "~/session.server";
import { verifyLogin } from "~/models/user.server";
import { safeRedirect, validateEmail } from "~/utils";

import * as S from '~/styled-components/login'
import InputBox from '~/styled-components/components/inputs/authInput'
import { FiChevronRight } from 'react-icons/fi';

export const action = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/");
  const remember = formData.get("remember");

  if (!validateEmail(email)) {
    return json({ errors: { email: "Email is invalid" } }, { status: 400 });
  }

  if (typeof password !== "string" || password.length === 0) {
    return json(
      { errors: { password: "Password is required" } },
      { status: 400 }
    );
  }

  const user = await verifyLogin(email, password);

  if (!user) {
    return json(
      { errors: { password: "Invalid email or password" } },
      { status: 400 }
    );
  }

  const delegationId =
    user.delegate ? user.delegate.delegationId :
      user.delegationAdvisor ?
        user.delegationAdvisor.delegationId : undefined

  return createUserSession({
    request,
    userId: user.id,
    delegationId: delegationId,
    remember: false,
    redirectTo,
  });
}

export const loader = async ({ request }) => {
  const userId = await getUserId(request)
  return userId ? redirect('/') : json({})
}

const LoginPage = () => {

  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard/home";
  const transition = useTransition()
  const actionData = useActionData()

  useEffect(() => {
    console.log(transition.state)
  }, [transition])

  return (
    <S.Wrapper>
      <S.FormContainer>
        <S.TitleBox>
          <S.Title>
            FAMUN 2023
          </S.Title>

          <S.ArrowIconBox />

          <S.SubTitle>
            Login
          </S.SubTitle>
        </S.TitleBox>

        <S.AuthForm method="post" noValidate>
          <InputBox name="email" text="Email" type="email" err={actionData?.errors?.email} autoFocus={true} />

          <InputBox name="password" text="Senha" type="password" err={actionData?.errors?.password} />

          <S.ForgotLinkBox>
            <S.StyledLink
              to="/resetPassword"
            >
              Esqueceu a Senha?
            </S.StyledLink>
          </S.ForgotLinkBox>

          <input type="hidden" name="redirectTo" value={redirectTo} />

          <S.ButtonContainer>
            <S.SubmitButton
              type="submit"
              name="button"
              value="firstButton"
              disabled={transition.state !== "idle"}
            >
              <p>Entrar</p>
            </S.SubmitButton>
          </S.ButtonContainer>
        </S.AuthForm>

        <S.JoinLinkBox>
          Ainda não tem uma conta?
          <S.StyledLink
            to="/join/user"
          >
            Cadastrar
          </S.StyledLink>
        </S.JoinLinkBox>
      </S.FormContainer>
    </S.Wrapper>
  )
}

export default LoginPage
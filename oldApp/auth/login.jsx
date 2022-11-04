import { useEffect } from 'react'
import { Link, useSearchParams, useActionData, useLoaderData } from '@remix-run/react'
import { json } from '@remix-run/node';

import { getUserId, createUserSession } from "~/session.server";
import { verifyLogin } from "~/models/user.server";
import { safeRedirect, validateEmail } from "~/utils";

import * as S from '~/styled-components/auth/login'
import InputBox from '~/styled-components/components/inputs/authInput'
import img from '~/images/team.svg'

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

  return createUserSession({
    request,
    userId: user.id,
    delegationId: user.delegationId,
    remember: false,
    redirectTo,
  });
}

export const loader = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

const LoginPage = () => {

  const actionData = useActionData()

  useEffect(() => {
    if (actionData?.errors?.email) {
    } else if (actionData?.errors?.password) {
    }
  }, [actionData]);

  return (
    <S.Wrapper>
      <S.Container>
        <S.FormContainer>
          <S.Title>
            Entrar
          </S.Title>
          <S.SubTitle>
            Faça o login para conferir sua inscrição e da sua equipe!
          </S.SubTitle>
          <S.AuthForm method="post" noValidate>
            <InputBox name="email" text="Email" type="email" err={actionData?.errors?.email} />

            <InputBox name="password" text="Senha" type="password" err={actionData?.errors?.password} />

            <S.ButtonContainer>
              <S.SubmitButton
                type="submit"
                name="button"
                value="firstButton"
              >
                <p>Entrar</p>
              </S.SubmitButton>
            </S.ButtonContainer>
          </S.AuthForm>
        </S.FormContainer>

        <S.ImageLinkWrapper>
          <S.Image src={img} />
          <S.LinkContainer>
            Ainda não tem uma conta? {" "}
            <S.LoginLink
              to={{
                pathname: "/auth/join",
                /* search: searchParams.toString(), */
              }}
            >
              Cadastrar
            </S.LoginLink>
          </S.LinkContainer>
        </S.ImageLinkWrapper>

      </S.Container>
    </S.Wrapper>

  )
}

export default LoginPage
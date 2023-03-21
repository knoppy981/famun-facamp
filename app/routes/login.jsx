import { useState, useRef } from 'react'
import { useActionData, useSearchParams, useTransition, Link, useFetcher } from '@remix-run/react'
import { json, redirect } from '@remix-run/node';
import { useTranslation } from 'react-i18next'

import { getUserId, createUserSession } from "~/session.server";
import { verifyLogin } from "~/models/user.server";
import { safeRedirect, validateEmail } from "~/utils";
import { i18nCookie } from '~/cookies';

import * as S from '~/styled-components/login'
import * as D from '~/styled-components/components/dropdown'
import { useClickOutside } from "~/hooks/useClickOutside";
import InputBox from '~/styled-components/components/inputs/authInput'
import { FiGlobe, FiX } from 'react-icons/fi';
import LanguageMenu from '~/styled-components/components/dropdown/languageMenu';
import Spinner from '~/styled-components/components/spinner';

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
    delegationId: user?.delegation?.id,
    remember: false,
    redirectTo,
  });
}

export const loader = async ({ request }) => {
  const userId = await getUserId(request)
  return userId ? redirect('/') : json({})
}

export const handle = {
  //handle the file it pulls to translate
  i18n: "login"
};

const LoginPage = () => {

  const { t, i18n } = useTranslation("login")

  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard/home";
  const transition = useTransition()
  const actionData = useActionData()

  return (
    <S.Wrapper>
      <LanguageMenu i18n={i18n} />

      <S.FormContainer>
        <S.TitleBox>
          <S.Title>
            FAMUN 2023
          </S.Title>

          <S.ArrowIconBox />

          <S.SubTitle>
            {t('title')}
          </S.SubTitle>
        </S.TitleBox>

        <S.AuthForm method="post" noValidate>
          <InputBox name="email" text={t("email")} type="email" err={actionData?.errors?.email} autoFocus={true} />

          <InputBox name="password" text={t("password")} type="password" err={actionData?.errors?.password} />

          <S.ForgotLinkBox>
            <S.StyledLink
              to=/* "/resetPassword" */ "/"
            >
              {t("forgotPassword")}
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
              {t("login")} {transition.state !== 'idle' && <Spinner dim={18} />}
            </S.SubmitButton>
          </S.ButtonContainer>
        </S.AuthForm>

        <S.JoinLinkBox>
          {t("acc")}
          <S.StyledLink
            to={{
              pathname: "/join/user",
              search: searchParams.toString(),
            }}
          >
            {t("join")}
          </S.StyledLink>
        </S.JoinLinkBox>
      </S.FormContainer>
    </S.Wrapper>
  )
}

export default LoginPage
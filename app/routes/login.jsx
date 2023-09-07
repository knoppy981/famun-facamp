import { useState, useRef } from 'react'
import { useActionData, useSearchParams, useTransition, useFetcher, Form } from '@remix-run/react'
import { json, redirect } from '@remix-run/node';
import { useTranslation } from 'react-i18next'
import qs from 'qs'

import { getUserId, createUserSession } from "~/session.server";
import { verifyLogin } from "~/models/user.server";
import { safeRedirect } from "~/utils";
import { i18nCookie } from '~/cookies';

import * as S from '~/styled-components/login'
import LanguageMenu from '~/styled-components/components/dropdown/languageMenu';
import Spinner from '~/styled-components/components/spinner';
import DefaultInputBox from '~/styled-components/components/inputBox/default';
import TextField from '~/styled-components/components/textField';
import DefaultButtonBox from '~/styled-components/components/buttonBox/default';
import Button from '~/styled-components/components/button';
import Checkbox from '~/styled-components/components/checkbox'
import Link from '~/styled-components/components/link';

export const action = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/");
  const remember = formData.get("remember");

  try {
  } catch (error) {
    error = qs.parse(error.message)
    return json(
      { errors: { [error.key]: error.msg } },
      { status: 400 }
    );
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
    remember: remember === "on" ? true : false,
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

  /* const { t, i18n } = useTranslation("login") */

  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard/home";
  const fetcher = useFetcher()
  const actionData = fetcher.data
  const transition = fetcher.state

  return (
    <S.Wrapper>
      <S.Container>
        <S.Title>
          FAMUN 2023
        </S.Title>

        <fetcher.Form method="post" noValidate>
          <S.FormContainer>
            <DefaultInputBox>
              <TextField
                label="e-mail"
                name="email"
                type="email"
                err={actionData?.errors?.email}
              />
            </DefaultInputBox>

            <DefaultInputBox>
              <TextField
                label="password"
                name="password"
                type="password"
                defaultValue={null}
                err={actionData?.errors?.password}
              />
            </DefaultInputBox>

            <Checkbox
              name="rememeber"
            >
              Remember me
            </Checkbox>

            <S.LinkBox>
              <Link
                to=/* "/resetPassword" */ "/"
                underline={1}
              >
                Forgot Password?
              </Link>
            </S.LinkBox>

            <input type="hidden" name="redirectTo" value={redirectTo} />

            <S.ButtonContainer>
              <DefaultButtonBox>
                <Button
                  type="submit"
                  disabled={transition !== "idle"}
                >
                  Log in {transition !== 'idle' && <Spinner dim={18} />}
                </Button>
              </DefaultButtonBox>
            </S.ButtonContainer>
          </S.FormContainer>
        </fetcher.Form>

        <S.LinkBox center={true}>
          Don't have an account?
          <Link
            to={{
              pathname: "/join/user",
              search: searchParams.toString(),
            }}
            underline={1}
          >
            Sign in
          </Link>
        </S.LinkBox>
      </S.Container >
    </S.Wrapper >
  )
}

export default LoginPage
import { useSearchParams, useFetcher } from '@remix-run/react'
import { json, redirect } from '@remix-run/node';
import { useTranslation } from 'react-i18next'

import { getUserId, createUserSession } from "~/session.server";
import { verifyLogin } from "~/models/user.server";
import { getCorrectErrorMessage, safeRedirect } from "~/utils";
import { loginSchema } from '~/schemas/login';

import * as S from '~/styled-components/login'
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
    await loginSchema.validateAsync({ email, password })
  } catch (error) {
    const [label, msg] = getCorrectErrorMessage(error)
    return json(
      { errors: { [label]: msg } },
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

  const { t } = useTranslation("login")

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
                label={t("email")}
                name="email"
                type="email"
                err={actionData?.errors?.email}
                action={actionData}
              />
            </DefaultInputBox>

            <DefaultInputBox>
              <TextField
                label={t("password")}
                name="password"
                type="password"
                defaultValue={null}
                err={actionData?.errors?.password}
                action={actionData}
              />
            </DefaultInputBox>

            <Checkbox
              name="rememeber"
            >
              {t("remember")}
            </Checkbox>

            <S.LinkBox>
              <Link
                to="/requestPasswordReset"
                underline={1}
              >
                {t("forgotPassword")}
              </Link>
            </S.LinkBox>

            <input type="hidden" name="redirectTo" value={redirectTo} />

            <S.ButtonContainer>
              <DefaultButtonBox>
                <Button
                  type="submit"
                  isDisabled={transition !== "idle"}
                >
                  {t("login")} {transition !== 'idle' && <Spinner dim={18} />}
                </Button>
              </DefaultButtonBox>
            </S.ButtonContainer>
          </S.FormContainer>
        </fetcher.Form>

        <S.LinkBox center={true}>
          {t("acc")}
          <Link
            to={{
              pathname: "/join/user",
              search: searchParams.toString(),
            }}
            underline={1}
          >
            {t("join")}
          </Link>
        </S.LinkBox>
      </S.Container >
    </S.Wrapper >
  )
}

export default LoginPage
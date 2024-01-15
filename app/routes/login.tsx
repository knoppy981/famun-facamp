
import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node';

import { safeRedirect } from '~/utils';
import { loginSchema } from '~/schemas/login';
import { getCorrectErrorMessage } from '~/utils/error';
import { verifyLogin } from '~/models/user.server';
import { createUserSession, getUserId } from '~/session.server';
import { useFetcher, useSearchParams } from '@remix-run/react';
import { useTranslation } from 'react-i18next';

import Button from '~/components/button';
import TextField from '~/components/textfield';
import Checkbox from '~/components/checkbox';
import DefaultLink from '~/components/link';
import Spinner from '~/components/spinner';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request)
  return userId ? redirect('/') : json({})
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
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

export const handle = { i18n: "login" };

export const meta: MetaFunction = () => [{ title: "Login" }];

interface ActionData {
  errors?: {
    email?: string;
    password?: string;
  };
}

const Login = () => {

  const { t } = useTranslation("login")

  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard/home";
  const fetcher = useFetcher()
  const actionData = fetcher.data as ActionData
  const transition = fetcher.state

  return (
    <main className="auth-wrapper">
      <div className='auth-container'>
        <h1 className='auth-title'>
          FAMUN 2024
        </h1>

        <fetcher.Form method='post' className='auth-form' noValidate>
          <TextField
            label={t("email")}
            className='primary-input-box'
            name="email"
            type="email"
            isInvalid={actionData?.errors?.email ? true : false}
            errorMessage={actionData?.errors?.email}
            action={actionData}
          />

          <TextField
            label={t("password")}
            className='primary-input-box'
            name="password"
            type="password"
            isInvalid={actionData?.errors?.email ? true : false}
            errorMessage={actionData?.errors?.password}
            action={actionData}
          />

          <Checkbox
            name="remember"
          >
            {t("remember")}
          </Checkbox>

          <div className='auth-link-box'>
            <DefaultLink to="/forgotPassword" underline={1}>
              {t("forgotPassword")}
            </DefaultLink>
          </div>

          <input type="hidden" name="redirectTo" value={redirectTo} />

          <div className='auth-button-container'>
            <Button type='submit' className='primary-button-box'>
              {t("login")} {transition !== 'idle' && <Spinner dim="18px" />}
            </Button>
          </div>
        </fetcher.Form>

        <div className='auth-link-box center'>
          {t("acc")}
          <DefaultLink
            underline={1}
            to={{
              pathname: "/join/user",
              search: searchParams.toString(),
            }}
          >
            {t("join")}
          </DefaultLink>
        </div>
      </div>
    </main>
  )
}

export default Login

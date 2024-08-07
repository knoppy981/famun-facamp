import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node';

import { safeRedirect } from '~/utils';
import { loginSchema } from '~/schemas/login';
import { getCorrectErrorMessage } from '~/utils/error';
import { verifyLogin } from '~/models/user.server';
import { createAdminSession, createUserSession, getUserId } from '~/session.server';
import { useFetcher, useSearchParams } from '@remix-run/react';
import { useTranslation } from 'react-i18next';

import Button from '~/components/button';
import TextField from '~/components/textfield';
import Checkbox from '~/components/checkbox';
import DefaultLink from '~/components/link';
import Spinner from '~/components/spinner';
import { verifyAdmin } from '~/models/admin.server';

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

  const user = await verifyLogin(email, password)
  const admin = await verifyAdmin(email, password)

  if (!user && !admin) {
    return json(
      { errors: { password: "E-mail ou senha inválidos" } },
      { status: 400 }
    );
  }

  return admin ?
    createAdminSession({
      request,
      adminId: admin.id
    }) :
    createUserSession({
      request,
      userId: user?.id as string,
      delegationId: user?.delegation?.id,
      remember: remember === "on" ? true : false,
      redirectTo,
    })
}

interface ActionData {
  errors?: {
    email?: string;
    password?: string;
  };
}

const Login = () => {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard/home";
  const fetcher = useFetcher()
  const actionData = fetcher.data as ActionData
  const transition = fetcher.state

  return (
    <main className="auth-wrapper">
      <div className='auth-container'>
        <h1 className='auth-title'>
          FAMUN {new Date().getFullYear()}
        </h1>

        <fetcher.Form method='post' className='auth-form' noValidate>
          <TextField
            label="E-mail"
            className='primary-input-box'
            name="email"
            type="email"
            isInvalid={actionData?.errors?.email ? true : false}
            errorMessage={actionData?.errors?.email}
            action={actionData}
          />

          <TextField
            label="Senha"
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
            Continuar Conectado
          </Checkbox>

          <div className='auth-link-box'>
            <DefaultLink to="/password/request" underline={1}>
              Esqueceu a senha?
            </DefaultLink>
          </div>

          <input type="hidden" name="redirectTo" value={redirectTo} />

          <div className='auth-button-container'>
            <Button type='submit' className='primary-button-box'>
              Entrar {transition !== 'idle' && <Spinner dim="18px" />}
            </Button>
          </div>
        </fetcher.Form>

        <div className='auth-link-box center'>
          Ainda não tem uma conta?
          <DefaultLink
            underline={1}
            to={{
              pathname: "/join/user",
              search: searchParams.toString(),
            }}
          >
            Cadastrar
          </DefaultLink>
        </div>
      </div>
    </main>
  )
}

export default Login

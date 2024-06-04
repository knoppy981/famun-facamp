import { ActionFunctionArgs, LoaderFunctionArgs, json } from '@remix-run/node';
import qs from "qs"
import { Form, useActionData, useLoaderData, useNavigation, useSearchParams } from '@remix-run/react';
import React from 'react'
import invariant from 'tiny-invariant';
import Button from '~/components/button';
import Spinner from '~/components/spinner';
import TextField from '~/components/textfield';
import { decodeJwt } from '~/jwt';
import { safeRedirect } from '~/utils';
import { checkConfirmationCode } from '../password.challenge.$token/route';
import { completePassword } from '~/schemas';
import { getCorrectErrorMessage } from '~/utils/error';
import { unsetConfirmationCode, updateUser } from '~/models/user.server';
import { generateHash } from './generateHash';
import { createUserSession } from '~/session.server';

export const action = async ({ request }: ActionFunctionArgs) => {
  const text = await request.text()
  let { password, confirmPassword, email, code, redirectTo } = qs.parse(text)
  redirectTo = safeRedirect(redirectTo as string, "/");

  try {
    await checkConfirmationCode(email as string, code as string)
  } catch (error: any) {
    console.log(error)
    throw json(
      { errors: { code: error.message } },
      { status: 400 }
    )
  }

  try {
    await completePassword.validateAsync({
      password: password,
      confirmPassword: confirmPassword
    })
  } catch (error) {
    console.log(error)
    const [label, msg] = getCorrectErrorMessage(error)
    return json(
      { errors: { [label]: msg } },
      { status: 400 }
    );
  }

  const user = await updateUser({
    email: email as string,
    values: {
      password: {
        update: {
          hash: await generateHash(password as string)
        }
      }
    }
  })

  await unsetConfirmationCode(user.email)

  return createUserSession({
    request,
    userId: user.id,
    delegationId: user?.delegationId as string,
    remember: true,
    redirectTo,
  });
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { token } = params
  invariant(token, "no challenge found")
  const decoded: any = await decodeJwt(token)

  if (decoded.err) throw json(decoded.err, { status: 400 });

  // token has information about the code, user and expiration time
  const { code, user, expiresAt } = decoded?.payload

  // check if the link has expired
  let now = new Date()
  if (now > expiresAt) throw json(
    { errors: { expiresAt: "Expired link, please request a new password reset" } },
    { status: 400 }
  );

  return json({ user, code })
}

const SubmitPassword = () => {
  const { user, code } = useLoaderData<typeof loader>()
  const transition = useNavigation()
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard/home";
  const actionData = useActionData<any>()

  return (
    <Form className='auth-container' style={{ gap: "15px" }} noValidate method='post'>
      <h1 className='auth-title'>
        FAMUN {new Date().getFullYear()}
      </h1>

      <div className='join-wrapper'>
        <h2 className='join-title'>
          Crie uma senha nova
        </h2>

        <p className='text' style={{ marginLeft: "5px" }}>
          Para proteger sua conta, escolha uma senha forte que você não usou antes e que tenha pelo menos 8 carácteres.
        </p>

        <div className='join-container'>
          <div className='join-input-container'>
            <TextField
              className='primary-input-box'
              name="password"
              label="Senha"
              aria-label="Senha"
              type="password"
              errorMessage={actionData?.errors?.password}
              action={actionData}
              autoComplete='off'
            />

            <TextField
              className='primary-input-box'
              name="confirmPassword"
              label="Confirme a Senha"
              aria-label="Confirme a Senha"
              type="password"
              errorMessage={actionData?.errors?.confirmPassword}
              action={actionData}
              autoComplete='off'
            />
          </div>

          <input type="hidden" name="email" value={user} />
          <input type="hidden" name="code" value={code} />
          <input type="hidden" name="redirectTo" value={redirectTo} />
        </div>
      </div>


      <div className='join-buttons-container' style={{ pointerEvents: transition.state === 'idle' ? 'auto' : 'none' }}>
        <Button
          className={`primary-button-box ${false ? "transparent" : ""}`}
          name="action"
          value="next"
          type="submit"
          isDisabled={false}
          onPress={() => { }}
        >
          Avançar
          {transition.state !== 'idle' && <Spinner dim="18px" />}
        </Button>
      </div>
    </Form>
  )
}

export default SubmitPassword

import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import { Form, Link, useActionData, useLoaderData, useNavigation } from '@remix-run/react'
import React from 'react'
import invariant from 'tiny-invariant'
import { decodeJwt } from '~/jwt'
import Button from '~/components/button'
import Spinner from '~/components/spinner'
import TextField from '~/components/textfield'
import { getConfirmationCode } from '~/models/user.server'
import { generateResetPasswordLink } from './utils/generateResetPasswordLink'

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const confirmationCode = formData.get("confirmationCode") as string;
  const user = formData.get("email") as string;
  let expiresAt

  try {
    expiresAt = await checkConfirmationCode(user, confirmationCode)
  } catch (error: any) {
    return json(
      { errors: { confirmationCode: error.message } },
      { status: 404 }
    )
  }

  let nextStepLink = await generateResetPasswordLink(confirmationCode, user, expiresAt)

  return redirect(nextStepLink)
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { token } = params
  invariant(token, "no challenge found")
  const decoded: any = await decodeJwt(token)

  if (decoded.err) throw json(decoded.err, { status: 404 });

  const { type, user } = decoded?.payload

  return json({ type, user })
}

const PasswordChallenge = () => {
  const { type, user } = useLoaderData<typeof loader>()
  const transition = useNavigation()
  const actionData = useActionData<typeof action>()

  return (
    <Form className='auth-container' style={{ gap: "15px" }} noValidate method='post'>
      <h1 className='auth-title'>
        FAMUN {new Date().getFullYear()}
      </h1>

      <div className='join-wrapper'>
        <h2 className='join-title'>
          Insira o código de 6 dígitos
        </h2>

        <p className='text' style={{ marginLeft: "5px" }}>
          Verifique se há um código de verificação para {user}. {" "}

          <Link to="/password/request">Mudar</Link>
        </p>

        <div className='join-container'>
          <div className='join-input-container'>
            <TextField
              className='primary-input-box'
              name="confirmationCode"
              label="Código"
              aria-label="Código"
              type="text"
              autoComplete='off'
              errorMessage={actionData?.errors?.confirmationCode}
              action={actionData}
            />
          </div>

          <p className='text' style={{ marginLeft: "5px" }}>
            Enviaremos um código de verificação a este e-mail se corresponder a uma conta na Famun.
          </p>

          <input type='hidden' name="email" value={user} />

          <p className='text italic' style={{ color: "#8a8989", marginLeft: "5px" }}>
            Se não encontrar um código na sua caixa de entrada, verifique a pasta de spam.
            Se não estiver lá, o e-mail pode não corresponder a uma conta na Famun.
          </p>
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

export async function checkConfirmationCode(email: string, input: string) {
  let confirmationCode = await getConfirmationCode(email)
  const now = new Date()

  if (!confirmationCode || now > confirmationCode.expiresAt || input !== confirmationCode.code) {
    throw new Error("Código Inválido")
  } else {
    return confirmationCode.expiresAt
  }
}

export default PasswordChallenge

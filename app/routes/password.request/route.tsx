import React from 'react'
import { json, redirect } from '@remix-run/node'
import { Form, useActionData, useNavigation } from '@remix-run/react'
import { ActionFunctionArgs } from 'react-router'

import { updateConfirmationCode } from '~/models/user.server'
import { requestPasswordReset } from '~/lib/emails'
import { sendEmail } from '~/nodemailer.server'
import { customEmail } from '~/schemas'
import { generateString, timeout } from '~/utils'
import { getCorrectErrorMessage } from '~/utils/error'

import Button from '~/components/button'
import Spinner from '~/components/spinner'
import TextField from '~/components/textfield'
import { generateChallengeLink } from './generateChallengeLink'

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;

  try {
    await customEmail.validateAsync(email)
  } catch (error) {
    const [label, msg] = getCorrectErrorMessage(error)
    return json(
      { errors: { email: msg } },
      { status: 400 }
    );
  }

  try {
    let code = generateString(6)
    const user = await updateConfirmationCode(email, code, 15)
    const info = await sendEmail({
      to: email,
      subject: `${user.name.split(' ', 2)[1] || user.name}, este é seu código ${code}`,
      html: requestPasswordReset(user, code)
    })
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code !== "P2025") {
      return json(
        { errors: { error: "Unexpected error, please refresh and try again" } },
        { status: 400 }
      );
    } else {
      await timeout(2000)
    }
  }

  const challenge = await generateChallengeLink("password", email)

  return redirect(challenge)
}

const PasswordRequest = () => {
  const transition = useNavigation()
  const actionData = useActionData<any>()

  return (
    <Form className='auth-container' style={{ gap: "15px" }} noValidate method='post'>
      <h1 className='auth-title'>
        FAMUN {new Date().getFullYear()}
      </h1>

      <div className='join-wrapper'>
        <h2 className='join-title'>
          Alterar a senha
        </h2>

        <div className='join-container'>
          <div className='join-input-container'>
            <TextField
              className='primary-input-box'
              name="email"
              label="E-mail"
              aria-label="E-mail"
              type="email"
              errorMessage={actionData?.errors?.email}
              action={actionData}
              autoComplete='off'
            />
          </div>

          <p className='text'>
            Enviaremos um código de verificação a este e-mail se corresponder a uma conta na Famun.
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

export default PasswordRequest

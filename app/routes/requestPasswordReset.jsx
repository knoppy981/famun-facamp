import { json, redirect } from '@remix-run/node'
import { useFetcher, useSearchParams } from '@remix-run/react'

import { customEmail } from '~/schemas/keys/email'
import { generateString, getCorrectErrorMessage, timeout } from '~/utils'
import { sendEmail } from '~/nodemailer'
import { updateConfirmationCode } from '~/models/user.server'
import { generateChallengeLink } from '~/challenges.server'

import * as S from '~/styled-components/challenge'
import Button from '~/styled-components/components/button'
import DefaultInputBox from '~/styled-components/components/inputBox/default'
import TextField from '~/styled-components/components/textField'
import DefaultButtonBox from '~/styled-components/components/buttonBox/default'
import { FiArrowLeft } from 'react-icons/fi'
import Link from '~/styled-components/components/link'
import Spinner from '~/styled-components/components/spinner'


export const action = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");

  try {
    await customEmail.validateAsync(email)
  } catch (error) {
    console.log(error)
    const [label, msg] = getCorrectErrorMessage(error)
    return json(
      { errors: { email: msg } },
      { status: 400 }
    );
  }

  try {
    let code = generateString(6)
    await updateConfirmationCode(email, code, 15)
    const info = await sendEmail({
      to: email,
      subject: "Change Famun password",
      html: `
        <h1 style="color: #a434a8;">Hello world!</h1>
        <p>Testing nodemailer</p>
        <p>Code: ${code}</p>
      `
    })
  } catch (error) {
    console.log(error)
    if (error.code !== "P2025") {
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

const forgotPassword = () => {

  const [searchParams] = useSearchParams();
  const fetcher = useFetcher()
  const actionData = fetcher.data
  const transition = fetcher.state

  return (
    <S.Wrapper>
      <S.GoBackLinkWrapper>
        <Link
          to={{
            pathname: '/login',
            search: searchParams.toString()
          }}
        >
          <FiArrowLeft /> Voltar
        </Link>
      </S.GoBackLinkWrapper>

      <S.Container>
        <S.Title>
          FAMUN 2023
        </S.Title>

        <fetcher.Form method="post">
          <S.FormContainer>
            <S.Subtitle>
              Esqueci a senha
            </S.Subtitle>

            <DefaultInputBox>
              <TextField
                label="E-mail"
                name="email"
                type="email"
                defaultValue={null}
                err={actionData?.errors?.email}
                action={actionData}
              />
            </DefaultInputBox>

            <p>
              Enviaremos um código de verificação a este e-mail se corresponder a uma conta na Famun.
            </p>

            <S.ButtonContainer>
              <DefaultButtonBox>
                <Button
                  type="submit"
                  isDisabled={transition !== "idle"}
                >
                  Avançar
                  {transition !== 'idle' && <Spinner dim={18} />}
                </Button>
              </DefaultButtonBox>
            </S.ButtonContainer>
          </S.FormContainer>
        </fetcher.Form>
      </S.Container>
    </S.Wrapper>
  )
}

export default forgotPassword
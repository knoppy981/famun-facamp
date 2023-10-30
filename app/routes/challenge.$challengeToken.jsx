import { json, redirect } from '@remix-run/node'
import { useCatch, useFetcher, useLoaderData, useSearchParams } from '@remix-run/react'
import invariant from 'tiny-invariant'

import { checkConfirmationCode, decodeJwt, generateSubmitPasswordRequestLink } from '~/challenges.server'

import * as S from '~/styled-components/challenge'
import * as E from '~/styled-components/error'
import Button from '~/styled-components/components/button'
import DefaultInputBox from '~/styled-components/components/inputBox/default'
import TextField from '~/styled-components/components/textField'
import DefaultButtonBox from '~/styled-components/components/buttonBox/default'
import { FiArrowLeft } from 'react-icons/fi'
import Link from '~/styled-components/components/link'
import Spinner from '~/styled-components/components/spinner'
import { unsetConfirmationCode } from '~/models/user.server'

export const action = async ({ request }) => {
  const formData = await request.formData();
  const confirmationCode = formData.get("confirmationCode");
  const user = formData.get("user");
  let expiresAt

  try {
    expiresAt = await checkConfirmationCode(user, confirmationCode)
  } catch (error) {
    return json(
      { errors: { confirmationCode: error.message } },
      { status: 404 }
    )
  }

  let nextStepLink = await generateSubmitPasswordRequestLink(
    confirmationCode, user, expiresAt)

  return redirect(nextStepLink)
}

export const loader = async ({ params }) => {
  const { challengeToken } = params
  invariant(challengeToken, "no challenge found")
  const decoded = await decodeJwt(challengeToken)

  if (decoded.err) throw json(decoded.err, { status: 404 });

  const { type, user } = decoded?.payload

  return json({ type, user })
}

const challenge = () => {
  const [searchParams] = useSearchParams();
  const { type, user } = useLoaderData()
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
              Insira o código de 6 dígitos
            </S.Subtitle>

            <p>
              Verifique se há um código de verificação para <b>{user}</b>.

              <Link
                to="/requestPasswordReset"
              >
                Mudar
              </Link>
            </p>

            <DefaultInputBox>
              <TextField
                label="Código"
                name="confirmationCode"
                type="confirmationCode"
                defaultValue={null}
                err={actionData?.errors?.confirmationCode}
                action={actionData}
                letterSpacing={"5px"}
              />
            </DefaultInputBox>

            <input type='hidden' name="user" value={user} />

            <p style={{ fontSize: "1.3rem", color: "#8a8989" }}>
              Se não encontrar um código na sua caixa de entrada, verifique a pasta de spam.
              Se não estiver lá, o e-mail pode não ter sido confirmado ou pode não corresponder a uma conta na Famun.
            </p>

            <S.ButtonContainer>
              <DefaultButtonBox>
                <Button
                  type="submit"
                  isDisabled={transition !== "idle"}
                >
                  Enviar
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

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return (
      <E.Container>
        <E.TitleBox>
          <E.Title>
            Erro!
          </E.Title>
        </E.TitleBox>

        <E.Message>
          Link inválido
        </E.Message>

        <E.GoBacklink to='/'>
          Voltar para página inicial
        </E.GoBacklink>
      </E.Container>
    );
  }

  throw new Error(`Unsupported thrown response status code: ${caught.status}`);
}

export function ErrorBoundary({ error }) {
  if (error instanceof Error) {
    return (
      <E.Container>
        <E.TitleBox>
          <E.Title>
            Erro!
          </E.Title>
        </E.TitleBox>

        <E.Message>
          {error.message} <E.GoBacklink to='/'>Voltar para página inicial</E.GoBacklink>
        </E.Message>
      </E.Container>
    );
  }
  return <E.Message>Oops, algo deu errado!</E.Message>;
}

export default challenge
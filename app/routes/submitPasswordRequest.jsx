import { json } from '@remix-run/node'
import qs from 'qs'
import { useSearchParams, useFetcher, useLoaderData, useCatch, useMatches } from '@remix-run/react'
import invariant from 'tiny-invariant'
import bcrypt from 'bcryptjs'

import { checkConfirmationCode, decodeJwt } from '~/challenges.server'
import { getCorrectErrorMessage, safeRedirect } from '~/utils'
import { completePassword } from '~/schemas/keys/password'
import { unsetConfirmationCode, updateUser } from '~/models/user.server'
import { createUserSession } from '~/session.server'

import * as S from '~/styled-components/challenge'
import * as E from '~/styled-components/error'
import Button from '~/styled-components/components/button'
import DefaultInputBox from '~/styled-components/components/inputBox/default'
import TextField from '~/styled-components/components/textField'
import DefaultButtonBox from '~/styled-components/components/buttonBox/default'
import { FiArrowLeft } from 'react-icons/fi'
import Link from '~/styled-components/components/link'
import Spinner from '~/styled-components/components/spinner'

export const action = async ({ request }) => {
  const text = await request.text()
  let { password, confirmPassword, userEmail, code, redirectTo } = qs.parse(text)
  redirectTo = safeRedirect(redirectTo, "/");

  try {
    await checkConfirmationCode(userEmail, code)
  } catch (error) {
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
    const [label, msg] = getCorrectErrorMessage(error)
    return json(
      { errors: { [label]: msg } },
      { status: 400 }
    );
  }

  const user = await updateUser({
    email: userEmail,
    values: {
      password: {
        update: {
          hash: await bcrypt.hash(password, 10)
        }
      }
    }
  })

  await unsetConfirmationCode(user.email)
  
  return createUserSession({
    request,
    userId: user.id,
    delegationId: user?.delegation?.id,
    remember: true,
    redirectTo,
  });
}

export const loader = async ({ request }) => {
  // get token from url
  const url = new URL(request.url);
  const t = url.searchParams.get("t");
  invariant(t, "no token found")
  const decoded = await decodeJwt(t)

  if (decoded.err) throw json(decoded.err, { status: 400 });

  // token has information about the code, user and expiration time
  const { code, user, expiresAt } = decoded?.payload

  // check if the link has expired
  let now = new Date()
  if (now > expiresAt) throw json(
    { errors: { expiresAt: "Expired link, please request a new password reset" } },
    { status: 400 }
  );

  console.log(user, code)

  return json({ user, code })
}

const submitPasswordRequest = () => {
  const { user, code } = useLoaderData()
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard/home";
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
              Crie uma senha nova
            </S.Subtitle>

            <p>
              Para proteger sua conta, escolha uma senha forte que você não usou antes e que tenha pelo menos 8 caracteres.
            </p>

            <DefaultInputBox>
              <TextField
                label="Senha"
                name="password"
                type="password"
                defaultValue={null}
                err={actionData?.errors?.password}
                action={actionData}
              />
            </DefaultInputBox>

            <DefaultInputBox>
              <TextField
                label="Redigitar nova senha"
                name="confirmPassword"
                type="password"
                defaultValue={null}
                err={actionData?.errors?.confirmPassword}
                action={actionData}
              />
            </DefaultInputBox>

            <input type="hidden" name="userEmail" value={user} />
            <input type="hidden" name="code" value={code} />
            <input type="hidden" name="redirectTo" value={redirectTo} />

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

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 400) {
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

export default submitPasswordRequest
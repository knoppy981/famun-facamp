import { useLoaderData, useCatch, Form, useMatches, useSearchParams } from '@remix-run/react'
import invariant from 'tiny-invariant';
import { json } from '@remix-run/node';

import { decodeInviteLink, getDelegationByCode, joinDelegation } from '~/models/delegation.server'
import { requireUserId, createUserSession, getUser } from "~/session.server";
import { safeRedirect } from '~/utils';

import * as S from '~/styled-components/invite'
import * as E from '~/styled-components/error'
import { FiArrowLeft } from "react-icons/fi";
import DefaultButtonBox from '~/styled-components/components/buttonBox/default';
import Button from '~/styled-components/components/button';
import Link from "~/styled-components/components/link";
/* import { useTranslation } from 'react-i18next'; */

export const action = async ({ request }) => {
  const userId = await requireUserId(request)
  const formData = await request.formData()
  const delegationCode = formData.get("delegationCode")

  invariant(delegationCode, "Delegation Code is required")

  const delegation = await joinDelegation({ code: delegationCode, userId: userId })
    .catch((err) => {
      throw json(err, { status: 404 })
    })

  invariant(delegation, "Delegation not Found")

  return createUserSession({
    request,
    userId: userId,
    delegationId: delegation.id,
    redirectTo: "/",
  });
}

export const loader = async ({ request, params }) => {
  const user = await getUser(request);
  const { token } = params
  invariant(token, "token is required")
  const decoded = await decodeInviteLink(token)

  if (decoded.err) throw json(decoded.err, { status: 404 });

  const { delegationCode } = decoded?.payload
  const delegation = await getDelegationByCode(delegationCode)
  console.log(delegationCode)

  if (user?.delegationId) throw json({ err: { user: "User already joined a delegation" } }, { status: 404 })

  if (!delegation) {
    throw json("Dleegation Not Found", { status: 404 });
  }

  return json({ delegation, user })
}

/* export const handle = {
  i18n: "translation"
}; */

const invite = () => {

  /* const { t, i18n } = useTranslation("translation") */
  const [searchParams] = useSearchParams();
  const matches = useMatches()
  const { delegation, user } = useLoaderData()

  return (
    <S.Wrapper>
      <S.GoBackLinkWrapper>
        <Link
          to={{
            pathname: '/',
            search: searchParams.toString()
          }}
        >
          <FiArrowLeft /> Início
        </Link>
      </S.GoBackLinkWrapper>

      <S.Container>
        <S.Title>
          FAMUN 2023
        </S.Title>

        <S.InviteForm method='post'>
          <S.FormTitle>
            Entre em sua delegação
          </S.FormTitle>

          <S.FormSubTitle>
            O {delegation.school} está te convidando para participar de sua delegação.
            {!user && <><br />Cadastre-se ou, se voce ja está cadastrado, entre na sua conta para participar.</>}
          </S.FormSubTitle>

          {user ?
            <S.ButtonsContainer>
              <DefaultButtonBox>
                <Button>
                  Entrar
                </Button>
              </DefaultButtonBox>
            </S.ButtonsContainer>
            :
            <S.ButtonsContainer>
              <DefaultButtonBox>
                <Link
                  to={{
                    pathname: `/join/user?${new URLSearchParams([["redirectTo", safeRedirect(matches[1].pathname)]])}`,
                  }}
                >
                  Cadastrar
                </Link>
              </DefaultButtonBox>

              <DefaultButtonBox>
                <Link
                  to={{
                    pathname: `/login?${new URLSearchParams([["redirectTo", safeRedirect(matches[1].pathname)]])}`,
                  }}
                >
                  Login
                </Link>
              </DefaultButtonBox>
            </S.ButtonsContainer>
          }

          <input type='hidden' name='delegationCode' value={delegation.code} />
        </S.InviteForm>
      </S.Container>
    </S.Wrapper >
  )
}

export function CatchBoundary() {
  const caught = useCatch();
  const matches = useMatches()

  if (caught.data?.err?.user) {
    return (
      <E.Container>
        <E.TitleBox>
          <E.Title>
            Erro 404
          </E.Title>
        </E.TitleBox>

        <E.Message>
          Voce ja está em uma delegação, deseja entrar com outra conta?
          <Form method='post' action='/logout'>
            <input type="hidden" name="redirectTo" value={`/login?${new URLSearchParams([["redirectTo", safeRedirect(matches[1].pathname)]])}`} />
            <E.GoBackButton type='submit'>
              Entrar com outra conta
            </E.GoBackButton>
          </Form>
        </E.Message>

        <E.GoBacklink to='/'>
          Voltar para página inicial
        </E.GoBacklink>
      </E.Container>
    );
  }

  if (caught.status === 404) {
    return (
      <E.Container>
        <E.TitleBox>
          <E.Title>
            Erro 404
          </E.Title>
        </E.TitleBox>

        <E.Message>
          {caught.data?.name === 'JsonWebTokenError' ?
            "O link que voce utilizou é inválido" : caught.data?.expiredAt ?
              'O link que voce utilizou expirou!' : 'A delegação que voce quer entrar não existe mais'}
          <E.GoBacklink to='/'>Voltar para página inicial</E.GoBacklink>
        </E.Message>
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
            Erro
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

export default invite
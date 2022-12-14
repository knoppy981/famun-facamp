import React from 'react'
import { useLoaderData, Link, useCatch, Form, useMatches } from '@remix-run/react'
import invariant from 'tiny-invariant';
import { json, redirect } from '@remix-run/node';

import { decodeInviteLink, getDelegationByCode, joinDelegation } from '~/models/delegation.server'
import { logout, getUserId, requireUserId, createUserSession, getUser } from "~/session.server";
import { safeRedirect } from '~/utils';

import * as S from '~/styled-components/invite'
import * as E from '~/styled-components/error'
import { FiHelpCircle, FiArrowLeft, } from "react-icons/fi";

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

  if (user?.delegationId) throw json({ err: { user: "User already joined a delegation" } }, { status: 404 })

  if (!delegation) {
    throw json("Dleegation Not Found", { status: 404 });
  }

  return json({ delegation })
}

const invite = () => {

  const { delegation } = useLoaderData()

  return (
    <S.Wrapper>
      <S.Container>
        <S.TitleBox>
          <S.Title>
            FAMUN 2023
          </S.Title>

          <S.ArrowIconBox />

          <S.Subtitle>
            Inscri????o
          </S.Subtitle>
        </S.TitleBox>

        <S.Navbar>
          <S.NavMenu>
            <Link to="/">
              <S.NavItem>
                <FiArrowLeft />
                In??cio
              </S.NavItem>
            </Link>
          </S.NavMenu>

          <S.NavMenu>
            <S.NavItem>
              <FiHelpCircle />
              Ajuda
            </S.NavItem>
          </S.NavMenu>
        </S.Navbar>

        <S.StepsForm method='post'>
          <S.FormTitle style={{ marginTop: '40px' }}>
            Entre em sua delega????o
          </S.FormTitle>

          <S.FormSubtitle>
            O {delegation.school} est?? te convidando para participar de sua delega????o
          </S.FormSubtitle>

          <input type='hidden' name='delegationCode' value={delegation.code} />

          <S.Button type='submit'>
            Entrar
          </S.Button>
        </S.StepsForm>
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
          Voce ja est?? em uma delega????o, deseja entrar com outra conta?
          <Form method='post' action='/logout'>
            <input type="hidden" name="redirectTo" value={`/login?${new URLSearchParams([["redirectTo", safeRedirect(matches[1].pathname)]])}`} />
            <E.GoBackButton type='submit'>
              Entrar com outra conta
            </E.GoBackButton>
          </Form>
        </E.Message>

        <E.GoBacklink to='/'>
          Voltar para p??gina inicial
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
            "O link que voce utilizou ?? inv??lido" : caught.data?.expiredAt ?
              'O link que voce utilizou expirou!' : 'A delega????o que voce quer entrar n??o existe mais'}
          <E.GoBacklink to='/'>Voltar para p??gina inicial</E.GoBacklink>
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
          {error.message} <E.GoBacklink to='/'>Voltar para p??gina inicial</E.GoBacklink>
        </E.Message>
      </E.Container>
    );
  }
  return <E.Message>Oops, algo deu errado!</E.Message>;
}

export default invite
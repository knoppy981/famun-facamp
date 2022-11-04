import React from 'react'
import { useLoaderData, Link } from '@remix-run/react'
import { json } from '@remix-run/node';

import { decodeInviteLink } from '~/models/delegation.server'
import { logout, getUserId } from "~/session.server";

import * as S from '~/styled-components/tokenAuth'

export const loader = async ({ request, params }) => {
  const userId = await getUserId(request);
  const url = new URL(request.url)

  if (userId) return logout({ request, redirectTo: url })

  const token = params.token
  const decoded = await decodeInviteLink(token)
  if (decoded.err) return json(decoded.err, { status: 400 })

  const { delegationCode /* , inviteFrom */ } = decoded?.payload
  const _params = new URLSearchParams([["delegationCode", delegationCode]]);
  const redirectTo = `/auth/signup?${_params}`;

  return json({ redirectTo /* , inviteFrom */ })
}

const TokenAuthenticaiton = () => {

  const { redirectTo } = useLoaderData()

  return (
    <S.Wrapper>
      <S.Container>
        <S.Title>
          Bem-vindo a Famun 2023
        </S.Title>

        <S.Subtitle>
          André Knopp te convidou para participar da delegação do <br /> <h2>Colégio Notre Dame Campinas</h2>
        </S.Subtitle>

        <S.ButtonContainer>
          <Link to={redirectTo}>
            <S.Button>
              <p>Fazer inscrição na Delegação</p>
            </S.Button>
          </Link>
        </S.ButtonContainer>
      </S.Container>
    </S.Wrapper>
  )
}

export default TokenAuthenticaiton
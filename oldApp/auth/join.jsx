import { json, redirect } from '@remix-run/node'
import { useOutletContext } from '@remix-run/react'
import { Link, useSearchParams } from '@remix-run/react'

import { useUser } from '~/utils'
import { getDelegationId } from '~/session.server'

import * as S from '~/styled-components/auth/join'
import selectTeam from '~/images/teamselect.svg'

const join = () => {

  const [searchParams] = useSearchParams();

  return (
    <S.Wrapper>
      <S.Container>
        <S.Info>
          <S.Title>
            Bem-vindo Delegado
          </S.Title>

          <S.Subtitle>
            <p>Comece sua inscrição agora,</p>
            Crie uma delegação ou entre na delegação do seu grupo!
          </S.Subtitle>
          <S.ButtonsContainer>
            <Link
              to={{
                pathname: "/auth/enter",
                /* search: searchParams.toString(), */
              }}
            >
              <S.Button>
                <p>Entre em uma delegação</p>
              </S.Button>
            </Link>
            <Link
              to={{
                pathname: "/auth/create",
                /* search: searchParams.toString(), */
              }}
            >
              <S.Button>
                <p>Crie uma nova delegação</p>
              </S.Button>
            </Link>
          </S.ButtonsContainer>
        </S.Info>
        <S.ImageLinkWrapper>
          <S.Image src={selectTeam} />
          <S.LinkContainer>
            Ja está cadastrado? {" "}
            <S.LoginLink
              to={{
                pathname: "/auth/login",
                /* search: searchParams.toString(), */
              }}
            >
              Entrar
            </S.LoginLink>
          </S.LinkContainer>
        </S.ImageLinkWrapper>

      </S.Container>

    </S.Wrapper>
  )
}

export default join
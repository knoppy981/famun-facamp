import React from 'react'

import { json } from '@remix-run/node'
import { useOutletContext } from '@remix-run/react'
import { useUser } from '~/utils'

import * as S from '~/styled-components/dashboard/home'

import createTeam from '~/images/createteam.svg'
import selectTeam from '~/images/teamcollab.svg'

export const loader = async () => {
  return json({})
}

const index = () => {

  const user = useUser()

  return (
    <S.Wrapper>
      <S.Title>
        Bem-vindo, <br /> {" "} {user.name}
      </S.Title>
      <S.Container>
        <S.Info>
          <S.InfoTitle>
            Ainda não encontrou sua delegação?
          </S.InfoTitle>
          <S.InfoSubtitle>
            Crie uma delegação ou entre na delegação do seu grupo!
          </S.InfoSubtitle>
          <S.ButtonsContainer>
            <S.Button >
              Cire uma nova delegação
            </S.Button>
            <S.Button >
              Entre em uma delegação
            </S.Button>
          </S.ButtonsContainer>
        </S.Info>
        <S.Image src={selectTeam} />
      </S.Container>
    </S.Wrapper>
  )
}

export default index
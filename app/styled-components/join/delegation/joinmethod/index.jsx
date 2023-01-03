import React from 'react'

import * as S from './elements'

const JoinMethod = () => {
  return (
    <>
      <S.Title>
        Participe de uma delegação
      </S.Title>

      <S.Subtitle>
        Crie uma delegação para sua equipe ou entre na delegação do seu grupo!
      </S.Subtitle>

      <S.ButtonsContainer>
        <S.Button name="joinType" type="submit" value="create">
          Criar nova delegação
        </S.Button>

        <S.Button name="joinType" type="submit" value="join">
          Entrar em uma Delegação
        </S.Button>
      </S.ButtonsContainer>
    </>
  )
}

export default JoinMethod
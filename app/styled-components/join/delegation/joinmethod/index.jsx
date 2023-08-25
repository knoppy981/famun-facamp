import React from 'react'

import * as S from './elements'
import DefaultButtonBox from '~/styled-components/components/buttonBox/default';
import Button from '~/styled-components/components/button';

const JoinMethod = () => {

  const [joinMethod, setJoinMethod] = React.useState("")

  return (
    <>
      <S.Title>
        Participe de uma delegação
      </S.Title>

      <S.Subtitle>
        Crie uma delegação para sua equipe ou entre na delegação do seu grupo!
      </S.Subtitle>

      <S.ButtonContainer>
        <DefaultButtonBox>
          <Button
            type="submit"
            name="action"
            value="next"
            onPress={() => setJoinMethod("create")}
          >
            Criar uma nova delagação
          </Button>
        </DefaultButtonBox>
        
        <DefaultButtonBox>
          <Button
            type="submit"
            name="action"
            value="next"
            onPress={() => setJoinMethod("join")}
          >
            Entrar em uma delegação
          </Button>
        </DefaultButtonBox>

        <input type='hidden' name='joinMethod' value={joinMethod}/>
      </S.ButtonContainer>
    </>
  )
}

export default JoinMethod
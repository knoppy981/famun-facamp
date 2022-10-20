import { Link } from '@remix-run/react'

import { useUser } from '~/utils'

import * as S from '~/styled-components/dashboard/index'
import { BsCheck } from 'react-icons/bs'

const index = () => {

  const user = useUser()

  return (
    <S.Wrapper>
      <S.ProfileBox>
        <S.UserName>
          {user.name}
        </S.UserName>
        <S.UserSchool>
          Colégio Notre Dame Campinas
        </S.UserSchool>
      </S.ProfileBox>

      <S.Container>
        <S.Title>
          Falta pouco para completar sua inscrição!
        </S.Title>
        <S.StepsContainer>
          <Link to='/dashboard/delegation'>
            <S.Step completed={true}>
              <S.StepTitle>
                Entrar para sua Delegação
              </S.StepTitle>
              <S.StepCompleteIcon />
            </S.Step>
          </Link>
          <Link to='/dashboard/profile/registration'>
            <S.Step completed={false}>
              <S.StepTitle>
                Dados de Inscrição
              </S.StepTitle>
              <S.StepCompleteIcon />
            </S.Step>
          </Link>
          <Link to='/'>
            <S.Step completed={false}>
              <S.StepTitle>
                Comprovante de Vacinação
              </S.StepTitle>
              <S.StepCompleteIcon />
            </S.Step>
          </Link>
          <Link to='/'>
            <S.Step completed={false}>
              <S.StepTitle>
                Finalizar Pagamento
              </S.StepTitle>
              <S.StepCompleteIcon />
            </S.Step>
          </Link>
        </S.StepsContainer>
      </S.Container>
    </S.Wrapper>
  )
}

export default index
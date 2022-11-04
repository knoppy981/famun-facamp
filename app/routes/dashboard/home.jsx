import { Link } from '@remix-run/react'

import { useUser } from '~/utils'

import * as S from '~/styled-components/dashboard/home'

const home = () => {

  const user = useUser()

  return (
    <S.Wrapper>
      <S.SubTitle>
        Etapas Concluídas
      </S.SubTitle>

      <S.Container>
        <Link to='/dashboard/delegation'>
          <S.Step completed={true}>
            Entrar para sua Delegação
            {/* <S.StepCompleteIcon /> */}
          </S.Step>
        </Link>
      </S.Container>

      <S.SubTitle>
        Clique nos links abaixo para completar a inscrição
      </S.SubTitle>

      <S.Container>
        <Link to='/dashboard/data'>
          <S.Step completed={false}>
            Preencher Dados de Inscrição
            {/* <S.StepCompleteIcon /> */}
          </S.Step>
        </Link>

        <Link to='/dashboard/documents'>
          <S.Step completed={false}>
            Enviar Documentos
            {/* <S.StepCompleteIcon /> */}
          </S.Step>
        </Link>

        <Link to='/dashboard/payment'>
          <S.Step completed={false}>
            Concluir Pagamento
            {/* <S.StepCompleteIcon /> */}
          </S.Step>
        </Link>
      </S.Container>
    </S.Wrapper>
  )
}

export default home
import * as S from './elements'
import DefaultInputBox from '~/styled-components/components/inputs/defaultInput'

const CreateUser = ({ data, actionData }) => {
  return (
    <>
      <S.Title>
        Criar Conta
      </S.Title>

      <S.Wrapper>
        <S.InputContainer>
          <DefaultInputBox
            name="email"
            text="E-mail"
            type="email"
            value={data?.email}
            err={actionData?.errors?.email}
            autoFocus={true}
          />

          <S.SubInputContainer>
            <DefaultInputBox
              name="password"
              text="Senha"
              type="password"
              value={data?.password}
              err={actionData?.errors?.password}
            />

            <DefaultInputBox
              name="confirmPassword"
              text="Confirme a Senha"
              type="password"
              value={data?.confirmPassword}
              err={actionData?.errors?.confirmPassword}
            />
          </S.SubInputContainer>
        </S.InputContainer>
      </S.Wrapper>
    </>
  )
}

export default CreateUser
import * as S from './elements'
import AuthInputBox from '~/styled-components/components/inputs/authInput'

const CreateUser = ({ data, actionData }) => {
  return (
    <>
      <S.Title>
        Criar Conta
      </S.Title>

      <S.Wrapper>
        <S.InputContainer>
          <AuthInputBox
            name="email"
            text="E-mail"
            type="email"
            value={data?.email}
            err={actionData?.errors?.email}
            autoFocus={true}
          />

          <S.SubInputContainer>
            <AuthInputBox
              name="password"
              text="Senha"
              type="password"
              value={data?.password}
              err={actionData?.errors?.password}
            />

            <AuthInputBox
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
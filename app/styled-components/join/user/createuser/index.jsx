import * as S from './elements'

import DefaultInputBox from '~/styled-components/components/inputBox/default';
import TextField from '~/styled-components/components/textField';


const CreateUser = ({ data, actionData }) => {
  return (
    <>
      <S.Title>
        Criar Conta
      </S.Title>

      <S.Wrapper>
        <S.InputContainer>
          <DefaultInputBox>
            <TextField
              name="email"
              label="E-mail"
              type="email"
              defaultValue={data?.email}
              err={actionData?.errors?.email}
              action={actionData}
            />
          </DefaultInputBox>

          <S.SubInputContainer>
            <DefaultInputBox>
              <TextField
                name="password"
                label="Senha"
                type="password"
                defaultValue={data?.password}
                err={actionData?.errors?.password}
                action={actionData}
              />
            </DefaultInputBox>

            <DefaultInputBox>
              <TextField
                name="confirmPassword"
                label="Confirme a Senha"
                type="password"
                defaultValue={data?.confirmPassword}
                err={actionData?.errors?.confirmPassword}
                action={actionData}
              />
            </DefaultInputBox>
          </S.SubInputContainer>
        </S.InputContainer>
      </S.Wrapper>
    </>
  )
}

export default CreateUser
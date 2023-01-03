import * as S from './elements'
import AuthInputBox from '~/styled-components/components/inputs/authInput'

const UserData = ({ data, actionData }) => {
  return (
    <>
      <S.Title>
        Dados Pessoais
      </S.Title>

      <S.InputContainer>
        <AuthInputBox
          name="name"
          text="Nome"
          type="text"
          value={data?.name}
          err={actionData?.errors?.name}
          autoFocus={true}
        />

        <div />

        <S.SubInputContainer>
          <AuthInputBox
            name="cpf"
            text="Cpf"
            type="text"
            value={data?.cpf}
            err={actionData?.errors?.cpf}
          />

          <AuthInputBox
            name="rg"
            text="Rg"
            type="text"
            value={data?.rg}
            err={actionData?.errors?.rg}
          />
        </S.SubInputContainer>

        <S.SubInputContainer>
          <AuthInputBox
            name="birthDate"
            text="Data de Nascimento"
            type="text"
            value={data?.birthDate}
            err={actionData?.errors?.birthDate}
          />
        </S.SubInputContainer>

        <S.SubInputContainer>
          <AuthInputBox
            name="phoneNumber"
            text="Telefone"
            type="text"
            value={data?.phoneNumber}
            err={actionData?.errors?.phoneNumber}
          />
        </S.SubInputContainer>
      </S.InputContainer>
    </>
  )
}

export default UserData
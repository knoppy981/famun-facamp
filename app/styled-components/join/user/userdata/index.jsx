import * as S from './elements'
import AuthInputBox from '~/styled-components/components/inputs/authInput'
import PhoneInputBox from '~/styled-components/components/inputs/authInput/phoneInput'
import DateInputBox from '~/styled-components/components/inputs/authInput/dateInput'

const UserData = ({ data, actionData }) => {
  return (
    <>
      <S.Title>
        Dados Pessoais
      </S.Title>

      <S.Wrapper>
        <S.InputContainer>
          <AuthInputBox
            name="name"
            text="Nome"
            type="text"
            value={data?.name}
            err={actionData?.errors?.name}
            autoFocus={true}
          />

          <S.SubInputContainer>
            {data?.nacionality === "Brazil" ?
              <AuthInputBox
                name="cpf"
                text="Cpf"
                type="text"
                value={data?.cpf}
                err={actionData?.errors?.cpf}
                mask={'999.999.999-99'}
              /> :
              <AuthInputBox
                name="passport"
                text="Número do Passaporte"
                type="text"
                value={data?.passport}
                err={actionData?.errors?.passport}
              />
            
            }

            <DateInputBox
              name="birthDate"
              text="Data de Nascimento"
              type="text"
              value={data?.birthDate}
              err={actionData?.errors?.birthDate}
            />

            <PhoneInputBox
              name="phoneNumber"
              text="Telefone"
              type="text"
              value={data?.phoneNumber}
              err={actionData?.errors?.phoneNumber}
            />
          </S.SubInputContainer>
        </S.InputContainer>
      </S.Wrapper>
    </>
  )
}

export default UserData
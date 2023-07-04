import * as S from './elements'
import DefaultInputBox from '~/styled-components/components/inputs/defaultInput'
import PhoneInputBox from '~/styled-components/components/inputs/defaultInput/phoneInput'
import DateInputBox from '~/styled-components/components/inputs/defaultInput/dateInput'

const UserData = ({ data, actionData }) => {
  return (
    <>
      <S.Title>
        Dados Pessoais
      </S.Title>

      <S.Wrapper>
        <S.InputContainer>
          <DefaultInputBox
            name="name"
            text="Nome"
            type="text"
            value={data?.name}
            err={actionData?.errors?.name}
            autoFocus={true}
          />

          <S.SubInputContainer>
            {data?.nacionality === "Brazil" ?
              <DefaultInputBox
                name="cpf"
                text="Cpf"
                type="text"
                value={data?.cpf}
                err={actionData?.errors?.cpf}
                mask={'999.999.999-99'}
              /> :
              <DefaultInputBox
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
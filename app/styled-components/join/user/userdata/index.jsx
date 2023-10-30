import { today, getLocalTimeZone, parseDate } from '@internationalized/date';

import * as S from './elements'
import DatePicker from '~/styled-components/components/datePicker'
import DefaultInputBox from '~/styled-components/components/inputBox/default';
import TextField from '~/styled-components/components/textField';
import PhoneNumberField from '~/styled-components/components/textField/phoneNumber';

const UserData = ({ data, actionData }) => {
  return (
    <>
      <S.Title>
        Dados Pessoais
      </S.Title>

      <S.Wrapper>
        <S.InputContainer>
          <DefaultInputBox>
            <TextField
              name="name"
              label="Nome"
              type="text"
              defaultValue={data?.name}
              err={actionData?.errors?.name}
              action={actionData}
            />
          </DefaultInputBox>

          <S.SubInputContainer>
            {data?.nacionality === "Brazil" ?
              <DefaultInputBox>
                <TextField
                  name="cpf"
                  label="CPF"
                  type="text"
                  defaultValue={data?.cpf}
                  err={actionData?.errors?.cpf}
                  action={actionData}
                  mask={'999.999.999-99'}
                />
              </DefaultInputBox>
              :
              <DefaultInputBox>
                <TextField
                  name="passport"
                  label="Número do Passaporte"
                  type="text"
                  defaultValue={data?.passport}
                  err={actionData?.errors?.passport}
                  action={actionData}
                />
              </DefaultInputBox>
            }

            <DefaultInputBox>
              <DatePicker
                name="birthDate"
                label="Data de Nascimento"
                err={actionData?.errors?.birthDate}
                action={actionData}
                maxValue={today(getLocalTimeZone())}
                defaultValue={data.birthDate ? parseDate(data.birthDate) : undefined}
              />
            </DefaultInputBox>

            <DefaultInputBox>
              <PhoneNumberField
                name="phoneNumber"
                label="Telefone"
                _defaultValue={data?.phoneNumber}
                onChange={() => { }}
                err={actionData?.errors?.phoneNumber}
                action={actionData}
              />
            </DefaultInputBox>
          </S.SubInputContainer>
        </S.InputContainer>
      </S.Wrapper>
    </>
  )
}

export default UserData
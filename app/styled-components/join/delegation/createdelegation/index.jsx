import React from 'react'

import * as S from './elements'
import DefaultInputBox from '~/styled-components/components/inputBox/default';
import TextField from '~/styled-components/components/textField';
import PhoneNumberField from '~/styled-components/components/textField/phoneNumber';
import { Select, Item } from '~/styled-components/components/select';

const CreateDelegation = ({ data, actionData }) => {
  return (
    <>
      <S.Title>
        Criar uma delegação
      </S.Title>

      <S.Wrapper>
        <S.InputContainer>
          <DefaultInputBox>
            <TextField
              name="school"
              label="Nome da Escola / Universidade"
              type="text"
              defaultValue={data?.school}
              err={actionData?.errors?.school}
              action={actionData}
            />
          </DefaultInputBox>

          <DefaultInputBox>
            <PhoneNumberField
              name="schoolPhoneNumber"
              label="Numero de Telefone da Escola / Universidade"
              _defaultValue={data?.schoolPhoneNumber}
              err={actionData?.errors?.schoolPhoneNumber}
              action={actionData}
            />
          </DefaultInputBox>

          <DefaultInputBox>
            <Select
              name="participationMethod"
              label="Método de participação"
              defaultSelectedKey={data?.participationMethod}
              items={[
                { id: "Presencial" },
                { id: "Online" },
                { id: "Ambos" }
              ]}
              err={actionData?.errors?.participationMethod}
            >
              {(item) => <Item>{item.id}</Item>}
            </Select>
          </DefaultInputBox>
        </S.InputContainer>
      </S.Wrapper>
    </>
  )
}

export default CreateDelegation
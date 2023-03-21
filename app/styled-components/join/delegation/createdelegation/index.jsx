import React from 'react'

import * as S from './elements'
import AuthInputBox from "~/styled-components/components/inputs/authInput";
import PhoneInputBox from '~/styled-components/components/inputs/authInput/phoneInput';

const CreateDelegation = ({ data, actionData }) => {
  return (
    <>
      <S.Title>
        Criar uma delegação
      </S.Title>

      <S.Wrapper>
        <S.InputContainer>
          <AuthInputBox
            name="schoolName"
            text="Nome da Escola / Universidade"
            type="text"
            value={data?.schoolName}
            err={actionData?.errors?.schoolName}
            autoFocus={true}
          />

          <PhoneInputBox
            name="schoolPhoneNumber"
            text="Numero de Telefone da Escola / Universidade"
            type="text"
            value={data?.schoolPhoneNumber}
            err={actionData?.errors?.schoolPhoneNumber}
          />

          <S.SelectContainer>
            <S.SelectTitle>
              Método de participação
            </S.SelectTitle>

            <S.Select
              name="participationMethod"
            >
              <S.Option value={"Presencial"}>Presencial</S.Option>
              <S.Option value={"Online"}>Online</S.Option>
              <S.Option value={"Ambos"}>Ambos</S.Option>
            </S.Select>
          </S.SelectContainer>
        </S.InputContainer>
      </S.Wrapper>
    </>
  )
}

export default CreateDelegation
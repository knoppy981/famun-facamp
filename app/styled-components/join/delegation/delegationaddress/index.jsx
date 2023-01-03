import React from 'react'

import * as S from './elements'
import AuthInputBox from "~/styled-components/components/inputs/authInput";

const index = ({ data, actionData }) => {
  return (
    <>
      <S.Title>
        Preencha o endereço da Escola / Universidade
      </S.Title>

      <S.InputContainer>
        <AuthInputBox
          name="address"
          text="Endereço"
          type="text"
          value={data?.address}
          err={actionData?.errors?.address}
          autoFocus={true}
        />

        <S.SubInputContainer>
          <AuthInputBox
            name="country"
            text="País"
            type="text"
            value={data?.country}
            err={actionData?.errors?.country}
          />

          <AuthInputBox
            name="cep"
            text="CEP"
            type="text"
            value={data?.cep}
            err={actionData?.errors?.cep}
          />
        </S.SubInputContainer>

        <S.SubInputContainer>
          <AuthInputBox
            name="state"
            text="Estado"
            type="text"
            value={data?.state}
            err={actionData?.errors?.state}
          />

          <AuthInputBox
            name="city"
            text="Cidade"
            type="text"
            value={data?.city}
            err={actionData?.errors?.city}
          />
        </S.SubInputContainer>

        <S.SubInputContainer>
          <AuthInputBox
            name="neighborhood"
            text="Bairro"
            type="text"
            value={data?.neighborhood}
            err={actionData?.errors?.neighborhood}
          />
        </S.SubInputContainer>

      </S.InputContainer>
    </>
  )
}

export default index
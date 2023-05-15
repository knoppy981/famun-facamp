import React from 'react'

import * as S from './elements'
import AuthInputBox from "~/styled-components/components/inputs/authInput";
import SelectInput from '~/styled-components/components/inputs/selectInput';
import { isoCountries } from '~/data/ISO-3661-1';

const index = ({ data, actionData }) => {
  return (
    <>
      <S.Title>
        Endereço da Escola / Universidade
      </S.Title>

      <S.Wrapper>
        <S.InputContainer>
          <AuthInputBox
            name="address"
            text="Endereço"
            type="text"
            value={data?.address}
            err={actionData?.errors?.address}
            autoFocus={true}
          />

          <SelectInput
            name="country"
            text="País"
            value={data?.country}
            selectList={Object.keys(isoCountries)}
            err={actionData?.errors?.country}
          />

          <S.SubInputContainer>
            <AuthInputBox
              name="cep"
              text="CEP"
              type="text"
              value={data?.cep}
              err={actionData?.errors?.cep}
              mask={'99999-999'}
            />

            <AuthInputBox
              name="state"
              text="Estado"
              type="text"
              value={data?.state}
              err={actionData?.errors?.state}
            />
          </S.SubInputContainer>

          <S.SubInputContainer>
            <AuthInputBox
              name="city"
              text="Cidade"
              type="text"
              value={data?.city}
              err={actionData?.errors?.city}
            />
            
            <AuthInputBox
              name="neighborhood"
              text="Bairro"
              type="text"
              value={data?.neighborhood}
              err={actionData?.errors?.neighborhood}
            />
          </S.SubInputContainer>
        </S.InputContainer>
      </S.Wrapper>
    </>
  )
}

export default index
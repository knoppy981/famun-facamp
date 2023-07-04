import { useState, useEffect } from 'react'

import * as S from './elements'
import DefaultInputBox from "~/styled-components/components/inputs/defaultInput";
import SelectInput from '~/styled-components/components/inputs/selectInput';
import { isoCountries } from '~/data/ISO-3661-1';
import { postalCodeMask } from '~/data/postal-codes';

const index = ({ data, actionData }) => {

  const [country, setCountry] = useState(data.country ?? "Brazil")

  return (
    <>
      <S.Title>
        Endereço da Escola / Universidade
      </S.Title>

      <S.Wrapper>
        <S.InputContainer>
          <DefaultInputBox
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
            value={data?.country ?? "Brazil"}
            selectList={Object.keys(isoCountries)}
            err={actionData?.errors?.country}
            func={e => setCountry(e.target.value)}
          />

          <S.SubInputContainer>
            <DefaultInputBox
              name="postalCode"
              text="Código Postal"
              type="text"
              value={data?.postalCode}
              err={actionData?.errors?.postalCode}
              mask={postalCodeMask[country] ?? undefined}
            />

            <DefaultInputBox
              name="state"
              text="Estado"
              type="text"
              value={data?.state}
              err={actionData?.errors?.state}
            />
          </S.SubInputContainer>

          <S.SubInputContainer>
            <DefaultInputBox
              name="city"
              text="Cidade"
              type="text"
              value={data?.city}
              err={actionData?.errors?.city}
            />

            <DefaultInputBox
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
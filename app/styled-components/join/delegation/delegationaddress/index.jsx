import { useState, useEffect } from 'react'

import * as S from './elements'
import { isoCountries } from '~/data/ISO-3661-1';
import { postalCodeMask } from '~/data/postal-codes';
import DefaultInputBox from '~/styled-components/components/inputBox/default';
import TextField from '~/styled-components/components/textField';
import { ComboBox, Item } from '~/styled-components/components/comboBox';

const index = ({ data, actionData }) => {

  function createCountryArray(countries) {
    return Object.keys(countries).map(countryName => {
      return {
        id: countryName
      };
    });
  }

  const countryArray = createCountryArray(isoCountries)

  let [country, setCountry] = useState(data.nacionality ?? "Brazil");

  return (
    <>
      <S.Title>
        Endereço da Escola / Universidade
      </S.Title>

      <S.Wrapper>
        <S.InputContainer>
          <DefaultInputBox>
            <TextField
              name="address"
              label="Endereço"
              type="text"
              defaultValue={data?.address}
              err={actionData?.errors?.address}
              action={actionData}
            />
          </DefaultInputBox>

          <DefaultInputBox>
            <ComboBox
              name="country"
              label="País"
              defaultItems={countryArray}
              err={actionData?.errors?.country}
              action={actionData}
              leftItem={<S.NacionalityFlag className={`flag-icon flag-icon-${isoCountries[country]?.toLowerCase()}`} />}
              onSelectionChange={setCountry}
              defaultInputValue={country}
            >
              {(item) => <Item>{item.id}</Item>}
            </ComboBox>
          </DefaultInputBox>

          <S.SubInputContainer>
            <DefaultInputBox>
              <TextField
                name="postalCode"
                label="Código Postal"
                type="text"
                defaultValue={data?.postalCode}
                err={actionData?.errors?.postalCode}
                action={actionData}
                mask={postalCodeMask[country] ?? undefined}
              />
            </DefaultInputBox>

            <DefaultInputBox>
              <TextField
                name="state"
                label="Estado"
                type="text"
                defaultValue={data?.state}
                err={actionData?.errors?.state}
                action={actionData}
              />
            </DefaultInputBox>
          </S.SubInputContainer>

          <S.SubInputContainer>
            <DefaultInputBox>
              <TextField
                name="city"
                label="Cidade"
                type="text"
                defaultValue={data?.city}
                err={actionData?.errors?.city}
                action={actionData}
              />
            </DefaultInputBox>

            <DefaultInputBox>
              <TextField
                name="neighborhood"
                label="Bairro"
                type="text"
                defaultValue={data?.neighborhood}
                err={actionData?.errors?.neighborhood}
                action={actionData}
              />
            </DefaultInputBox>
          </S.SubInputContainer>
        </S.InputContainer>
      </S.Wrapper>
    </>
  )
}

export default index
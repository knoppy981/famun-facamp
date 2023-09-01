import { useState } from 'react'

import * as S from './elements'
import { isoCountries } from '~/data/ISO-3661-1'
import DefaultInputBox from '~/styled-components/components/inputBox/default'
import { ComboBox, Item } from '~/styled-components/components/comboBox'

const Nacionality = ({ data, actionData }) => {
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
        Nacionalidade
      </S.Title>

      <S.Wrapper>
        <DefaultInputBox>
          <ComboBox
            name="nacionality"
            label="País de Nascimento"
            defaultItems={countryArray}
            err={actionData?.errors?.nacionality}
            action={actionData}
            leftItem={<S.NacionalityFlag className={`flag-icon flag-icon-${isoCountries[country]?.toLowerCase()}`} />}
            onSelectionChange={setCountry}
            defaultInputValue={country}
          >
            {(item) => <Item>{item.id}</Item>}
          </ComboBox>
        </DefaultInputBox>
      </S.Wrapper>
    </>
  )
}

export default Nacionality
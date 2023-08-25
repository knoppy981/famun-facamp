import React from 'react'

import { isoCountries } from '~/data/ISO-3661-1'
import { postalCodeMask } from '~/data/postal-codes';

import TextField from '~/styled-components/components/textField';
import DataChangeInputBox from '~/styled-components/components/inputBox/dataChange'
import { ComboBox, Item } from '~/styled-components/components/comboBox';
import * as S from "../elements"

const AddressData = (props) => {

  const { formData, isDisabled, handleChange, actionData } = props

  function createCountryArray(countries) {
    return Object.keys(countries).map(countryName => {
      return {
        id: countryName
      };
    });
  }
  const countryArray = createCountryArray(isoCountries)

  return (
    <S.Container>
      <S.ContainerTitle border="green">
        Endereço da Escola / Universidade
      </S.ContainerTitle>

      <DataChangeInputBox>
        <ComboBox
          name="address.country"
          label="Coutnry"
          isRequired
          defaultItems={countryArray}
          onSelectionChange={value => handleChange({ target: { name: "address.country", value: value } })}
          defaultInputValue={formData?.address?.country}
          isDisabled={isDisabled}
          err={actionData?.errors?.country}
        >
          {(item) => <Item>{item.id}</Item>}
        </ComboBox>

        <TextField
          name="address.postalCode"
          label="Código Postal"
          type="text"
          isRequired
          defaultValue={formData.address?.postalCode}
          onChange={handleChange}
          isDisabled={isDisabled}
          err={actionData?.errors?.postalCode}
          mask={postalCodeMask[formData?.address?.country] ?? undefined}
        />

        {[
          ["State", "address.state", "text"],
          ["City", "address.city", "text"],
          ["Address", "address.address", "text"],
          ["Neighborhood", "address.neighborhood", "text"],
        ].map((item, index) => (
          <TextField
            key={index}
            name={item[1]}
            label={item[0]}
            type={item[2]}
            isRequired
            defaultValue={formData.address[item[1].split('.')[1]]}
            onChange={handleChange}
            isDisabled={isDisabled}
            err={actionData?.errors?.[item[1].split('.')[1]]}
          />
        ))}
      </DataChangeInputBox>
    </S.Container>
  )
}

export default AddressData
import React from 'react'
import ComboBox, { Item } from '~/components/combobox';
import TextField from '~/components/textfield';

import { isoCountries } from '~/lib/ISO-3661-1';

const AddressData = (props: any) => {
  const { defaultValues, isDisabled, handleChange, actionData } = props

  function createCountryArray(countries: object) {
    return Object.keys(countries).map(countryName => {
      return {
        id: countryName
      };
    });
  }

  const countryArray = createCountryArray(isoCountries)

  return (
    <div className='data-box-container'>
      <h3 className="data-box-container-title green-border">
        Endereço da Escola / Universidade
      </h3>

      <div className='data-box-input-container'>
        <ComboBox
          className='secondary-input-box'
          name="address.country"
          label="País"
          isRequired
          defaultItems={countryArray}
          onSelectionChange={value => handleChange({ target: { name: "address.country", value: value } })}
          defaultInputValue={defaultValues?.address?.country}
          isDisabled={isDisabled}
          errorMessage={actionData?.errors?.country}
          action={actionData}
        >
          {(item) => <Item>{item.id}</Item>}
        </ComboBox>

        <TextField
          className='secondary-input-box'
          name="address.postalCode"
          label="Código Postal"
          type="text"
          isRequired
          defaultValue={defaultValues.address?.postalCode}
          onChange={handleChange}
          isDisabled={isDisabled}
          errorMessage={actionData?.errors?.postalCode}
          action={actionData}
        />

        {[
          ["Estado", "address.state", "text"],
          ["Cidade", "address.city", "text"],
          ["Endereço", "address.address", "text"],
        ].map((item, index) => (
          <TextField
            className='secondary-input-box'
            key={index}
            name={item[1]}
            label={item[0]}
            type={item[2]}
            isRequired
            defaultValue={defaultValues.address[item[1].split('.')[1]]}
            onChange={handleChange}
            isDisabled={isDisabled}
            errorMessage={actionData?.errors?.[item[1].split('.')[1]]}
            action={actionData}
          />
        ))}
      </div>
    </div>
  )
}

export default AddressData
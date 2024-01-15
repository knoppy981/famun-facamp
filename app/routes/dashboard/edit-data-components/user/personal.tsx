import { today, getLocalTimeZone, parseDate } from '@internationalized/date';
import React from 'react';
import ComboBox, { Item } from '~/components/combobox';
import DatePicker from '~/components/datePicker';
import TextField from '~/components/textfield';
import PhoneNumberField from '~/components/textfield/phoneNumberField';
import { isoCountries } from '~/lib/ISO-3661-1';

const PersonalData = (props: any) => {
  const { formData, handleChange, actionData, isDisabled, error } = props

  function createCountryArray(countries: object) {
    return Object.keys(countries).map(countryName => {
      return {
        id: countryName
      };
    });
  }

  const countryArray = createCountryArray(isoCountries)

  return (
    <div className={`data-box-container ${error ? "error" : ""}`}>
      <h3 className="data-box-container-title blue-border">
        Dados Pessoais
      </h3>

      <div className='data-box-input-container'>
        {[
          ["Email", "email", "email"],
          ["Name", "name", "text"],
        ].map((item, index) => (
          <TextField
            className="secondary-input-box"
            key={index}
            name={item[1]}
            label={item[0]}
            type={item[2]}
            onChange={handleChange}
            defaultValue={formData?.[item[1]]}
            isDisabled={isDisabled}
            errorMessage={actionData?.errors?.[item[1]]}
            action={actionData}
          />
        ))}

        <PhoneNumberField
          className="secondary-input-box"
          name="phoneNumber"
          label="Phone Number"
          isRequired
          _defaultValue={formData?.phoneNumber}
          onChange={value => handleChange({ target: { name: "phoneNumber", value: value } })}
          isDisabled={isDisabled}
          errorMessage={actionData?.errors?.phoneNumber}
          action={actionData}
        />

        <DatePicker
          className="secondary-input-box"
          name="birthDate"
          label="Birth Date"
          isRequired
          maxValue={today(getLocalTimeZone())}
          defaultValue={formData.birthDate ? parseDate(formData.birthDate) : undefined}
          onChange={value => handleChange({ target: { name: "birthDate", value: value ? value.toString() : null } })}
          isDisabled={isDisabled}
          errorMessage={actionData?.errors?.birthDate}
          action={actionData}
        />

        <ComboBox
          className="secondary-input-box"
          name="nacionality"
          label="Nacionality"
          isRequired
          defaultItems={countryArray}
          onSelectionChange={value => handleChange({ target: { name: "nacionality", value: value } })}
          defaultSelectedKey={formData?.nacionality}
          isDisabled={isDisabled}
          errorMessage={actionData?.errors?.nacionality}
          action={actionData}
        >
          {(item) => <Item>{item.id}</Item>}
        </ComboBox>

        {formData?.nacionality !== "Brazil" ?
          <TextField
            className="secondary-input-box"
            name="passport"
            label="Passport"
            type="text"
            isRequired
            value={formData?.passport ?? ""}
            onChange={handleChange}
            isDisabled={isDisabled}
            errorMessage={actionData?.errors?.passport}
            action={actionData}
          />
          :
          <>
            <TextField
              className="secondary-input-box"
              name="rg"
              label="RG"
              type="text"
              isRequired
              value={formData?.rg}
              onChange={handleChange}
              isDisabled={isDisabled}
              errorMessage={actionData?.errors?.rg}
              action={actionData}
            />

            {formData.cpf !== null ?
              <TextField
                className="secondary-input-box"
                name="cpf"
                label="CPF"
                type="text"
                isRequired
                value={formData?.cpf}
                onChange={handleChange}
                isDisabled={isDisabled}
                errorMessage={actionData?.errors?.cpf}
                action={actionData}
                placeholder='CPF opcional'
              /> : null}
          </>
        }
      </div>

      <div className='data-box-border' />
    </div>
  )
}

export default PersonalData
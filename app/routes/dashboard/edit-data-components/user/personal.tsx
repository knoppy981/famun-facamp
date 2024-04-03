import { today, getLocalTimeZone, parseDate } from '@internationalized/date';
import React from 'react';
import ComboBox, { Item } from '~/components/combobox';
import DatePicker from '~/components/datePicker';
import { Radio, RadioGroup } from '~/components/radioGroup';
import { Select } from '~/components/select';
import TextField from '~/components/textfield';
import PhoneNumberField from '~/components/textfield/phoneNumberField';
import { isoCountries } from '~/lib/ISO-3661-1';

const PersonalData = (props: any) => {
  const { defaultValues, handleChange, actionData, isDisabled, theme } = props
  function createCountryArray(countries: object) {
    return Object.keys(countries).map(countryName => {
      return {
        id: countryName
      };
    });
  }
  const countryArray = createCountryArray(isoCountries)
  const [country, setCountry] = React.useState(defaultValues?.nacionality)
  const rgRef = React.useRef<any>()
  const cpfRef = React.useRef<any>()
  const passportRef = React.useRef<any>()

  return (
    <div className={`data-box-container ${theme ?? ""}`}>
      <h3 className="data-box-container-title blue-border">
        Dados Pessoais
      </h3>

      <div className='data-box-input-container'>
        {[
          ["Email", "email", "email"],
          ["Nome completo", "name", "text"],
        ].map((item, index) => (
          <TextField
            className="secondary-input-box"
            key={index}
            name={item[1]}
            label={item[0]}
            type={item[2]}
            onChange={handleChange}
            defaultValue={defaultValues?.[item[1]]}
            isDisabled={isDisabled}
            errorMessage={actionData?.errors?.[item[1]]}
            action={actionData}
          />
        ))}

        <TextField
          className="secondary-input-box"
          name="socialName"
          label="Nome social"
          type="text"
          isRequired
          defaultValue={defaultValues?.socialName}
          onChange={handleChange}
          isDisabled={isDisabled}
          errorMessage={actionData?.errors?.socialName}
          action={actionData}
          placeholder='Opcional'
        />

        <PhoneNumberField
          className="secondary-input-box"
          name="phoneNumber"
          label="Telefone"
          isRequired
          _defaultValue={defaultValues?.phoneNumber}
          onChange={value => handleChange({ target: { name: "phoneNumber", value: value } })}
          isDisabled={isDisabled}
          errorMessage={actionData?.errors?.phoneNumber}
          action={actionData}
        />

        <DatePicker
          className="secondary-input-box"
          name="birthDate"
          label="Data de nascimento"
          isRequired
          maxValue={today(getLocalTimeZone())}
          defaultValue={defaultValues?.birthDate ? parseDate(defaultValues.birthDate) : undefined}
          onChange={value => handleChange({ target: { name: "birthDate", value: value ? value.toString() : null } })}
          isDisabled={isDisabled}
          errorMessage={actionData?.errors?.birthDate}
          action={actionData}
        />

        <Select
          className="secondary-input-box"
          name="sex"
          label="Sexo"
          isRequired
          onSelectionChange={value => handleChange({ target: { name: "sex", value: value } })}
          defaultSelectedKey={defaultValues?.sex}
          isDisabled={isDisabled}
          errorMessage={actionData?.errors?.birthDate}
          action={actionData}
        >
          <Item key='Masculino'>Masculino</Item>
          <Item key='Feminino'>Feminino</Item>
          <Item key='Outro'>Outro</Item>
        </Select>

        <ComboBox
          className="secondary-input-box"
          name="nacionality"
          label="Nacionalidade"
          isRequired
          defaultItems={countryArray}
          onSelectionChange={value => {
            setCountry(value)
            handleChange({ target: { name: "nacionality", value: value } })
            if (value === "Brazil") {
              handleChange({ target: { name: "rg", value: rgRef?.current?.value ?? defaultValues?.rg ?? "" } })
              handleChange({ target: { name: "cpf", value: cpfRef?.current?.value ?? defaultValues?.cpf ?? "" }, delete: !defaultValues?.cpf })
              handleChange({ target: { name: "passport", value: null }, delete: value === defaultValues?.nacionality })
            } else {
              handleChange({ target: { name: "passport", value: passportRef?.current?.value ?? defaultValues?.passport ?? "" } })
              handleChange({ target: { name: "rg", value: null }, delete: value === defaultValues?.nacionality })
              handleChange({ target: { name: "cpf", value: null }, delete: value === defaultValues?.nacionality })
            }
          }}
          defaultSelectedKey={defaultValues?.nacionality}
          isDisabled={isDisabled}
          errorMessage={actionData?.errors?.nacionality}
          action={actionData}
        >
          {(item) => <Item>{item.id}</Item>}
        </ComboBox>

        {country !== "Brazil" ?
          <TextField
            ref={passportRef}
            className="secondary-input-box"
            name="passport"
            label="Passporte"
            type="text"
            isRequired
            defaultValue={defaultValues?.passport ?? ""}
            onChange={handleChange}
            isDisabled={isDisabled}
            errorMessage={actionData?.errors?.passport}
            action={actionData}
          />
          :
          <>
            <TextField
              ref={rgRef}
              className="secondary-input-box"
              name="rg"
              label="RG"
              type="text"
              isRequired
              defaultValue={defaultValues?.rg}
              onChange={handleChange}
              isDisabled={isDisabled}
              errorMessage={actionData?.errors?.rg}
              action={actionData}
            />

            <TextField
              ref={cpfRef}
              className="secondary-input-box"
              name="cpf"
              label="CPF"
              type="text"
              isRequired
              defaultValue={defaultValues?.cpf}
              onChange={handleChange}
              isDisabled={isDisabled}
              errorMessage={actionData?.errors?.cpf}
              action={actionData}
              placeholder='CPF opcional'
            />
          </>
        }
      </div>

      <div className='data-box-border' />
    </div>
  )
}

export default PersonalData
import { today, getLocalTimeZone, parseDate } from '@internationalized/date';

import { isoCountries } from '~/data/ISO-3661-1'

import * as S from "../elements"
import TextField from '~/styled-components/components/textField';
import DataChangeInputBox from '~/styled-components/components/inputBox/dataChange'
import PhoneNumberField from '~/styled-components/components/textField/phoneNumber'
import DatePicker from '~/styled-components/components/datePicker'
import { ComboBox, Item } from '~/styled-components/components/comboBox';

const PersonalData = (props) => {

  const { formData, handleChange, actionData, isDisabled } = props

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
      <S.ContainerTitle border="blue">
        Dados Pessoais
      </S.ContainerTitle>

      <DataChangeInputBox>
        {[
          ["Name", "name", "text"],
          ["Email", "email", "email"],
        ].map((item, index) => (
          <TextField
            key={index}
            name={item[1]}
            label={item[0]}
            type={item[2]}
            isRequired
            onChange={handleChange}
            defaultValue={formData?.[item[1]]}
            isDisabled={isDisabled}
            err={actionData?.errors?.[item[1]]}
          />
        ))}

        <PhoneNumberField
          name="phoneNumber"
          label="Phone Number"
          isRequired
          _defaultValue={formData?.phoneNumber}
          onChange={value => handleChange({ target: { name: "phoneNumber", value: value } })}
          isDisabled={isDisabled}
          err={actionData?.errors?.phoneNumber}
        />

        <DatePicker
          name="birthDate"
          label="Birth Date"
          isRequired
          maxValue={today(getLocalTimeZone())}
          defaultValue={formData.birthDate ? parseDate(formData.birthDate) : ""}
          onChange={value => {
            handleChange({ target: { name: "birthDate", value: value ? value.toString() : null } })
            console.log(value ? value.toString() : null)
          }}
          isDisabled={isDisabled}
          err={actionData?.errors?.birthDate}
        />

        <ComboBox
          name="nacionality"
          label="Nacionality"
          isRequired
          defaultItems={countryArray}
          onSelectionChange={value => handleChange({ target: { name: "nacionality", value: value } })}
          defaultInputValue={formData?.nacionality}
          isDisabled={isDisabled}
          err={actionData?.errors?.nacionality}
        >
          {(item) => <Item>{item.id}</Item>}
        </ComboBox>

        <TextField
          name="document.value"
          label={formData?.nacionality === "Brazil" ? "Cpf" : "Passport"}
          type="text"
          isRequired
          /* defaultValue={formData?.document?.value} */
          value={formData?.document?.value}
          onChange={handleChange}
          isDisabled={isDisabled}
          mask={formData?.nacionality === "Brazil" ? '999.999.999-99' : null}
          err={actionData?.errors?.[formData?.nacionality === "Brazil" ? "cpf" : "passport"]}
        />
      </DataChangeInputBox>
    </S.Container>
  )
}

export default PersonalData
import React from 'react'

import * as S from "../elements"
import TextField from '~/styled-components/components/textField';
import PhoneNumberField from '~/styled-components/components/textField/phoneNumber'
import DataChangeInputBox from '~/styled-components/components/inputBox/dataChange'
import { Select, Item } from '~/styled-components/components/select';

const DelegationData = (props) => {

  const { formData, isDisabled, handleChange, actionData } = props

  return (
    <S.Container>
      <S.ContainerTitle border="green">
        Dados da Delegação
      </S.ContainerTitle>

      <DataChangeInputBox>
        <TextField
          name="school"
          label="School / University"
          type="text"
          isRequired
          defaultValue={formData?.school}
          onChange={handleChange}
          isDisabled={isDisabled}
          autoComplete="false"
          err={actionData?.errors?.school}
        />

        <PhoneNumberField
          name="schoolPhoneNumber"
          label="Contact Number"
          isRequired
          _defaultValue={formData?.schoolPhoneNumber}
          onChange={value => handleChange({ target: { name: "schoolPhoneNumber", value: value } })}
          isDisabled={isDisabled}
          err={actionData?.errors?.schoolPhoneNumber}
        />

        <Select
          name="participationMethod"
          label="Participação"
          defaultSelectedKey={formData?.participationMethod}
          onSelectionChange={value => handleChange({ target: { name: "participationMethod", value: value } })}
          items={[
            { id: "Presencial" },
            { id: "Online" },
            { id: "Ambos" }
          ]}
          err={actionData?.errors?.participationMethod}
          isDisabled={isDisabled}
        >
          {(item) => <Item>{item.id}</Item>}
        </Select>
      </DataChangeInputBox>
    </S.Container>
  )
}

export default DelegationData
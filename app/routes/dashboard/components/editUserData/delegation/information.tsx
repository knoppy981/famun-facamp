import React from 'react'
import { Item, Select } from '~/components/select'
import TextField from '~/components/textfield'
import PhoneNumberField from '~/components/textfield/phoneNumberField'

const DelegationData = (props: any) => {
  const { defaultValues, isDisabled, handleChange, actionData } = props

  return (
    <div className='data-box-container'>

      <h3 className="data-box-container-title green-border">
        Dados da Delegação
      </h3>

      <div className='data-box-input-container'>
        <TextField
          className='secondary-input-box'
          name="school"
          label="Escola / Universidade"
          type="text"
          isRequired
          defaultValue={defaultValues?.school}
          onChange={handleChange}
          isDisabled={isDisabled}
          autoComplete="off"
          errorMessage={actionData?.errors?.school}
          action={actionData}
        />

        <PhoneNumberField
          className='secondary-input-box'
          name="schoolPhoneNumber"
          label="Telefone para contato"
          isRequired
          _defaultValue={defaultValues?.schoolPhoneNumber}
          onChange={value => handleChange({ target: { name: "schoolPhoneNumber", value: value } })}
          isDisabled={isDisabled}
          errorMessage={actionData?.errors?.schoolPhoneNumber}
          action={actionData}
        />
      </div>
    </div>
  )
}

export default DelegationData
import React from 'react'
import { Radio, RadioGroup } from '~/components/radioGroup'
import TextArea from '~/components/textfield/textArea'

const EducationLevel = (props: any) => {
  const { defaultValues, handleChange, actionData, isDisabled, error } = props

  return (
    <div className="data-box-container">
      <h3 className="data-box-container-title blue-border">
        Nível Educacional
      </h3>

      <div className='data-box-secondary-input-container'>
        <RadioGroup
          label="Nível de Escolaridade"
          aria-label="Nível de Escolaridade"
          name="delegate.educationLevel"
          onChange={e => handleChange({ target: { name: "delegate.educationLevel", value: e } })}
          defaultValue={defaultValues?.delegate?.educationLevel}
          errorMessage={actionData?.errors?.educationLevel}
          action={actionData}
          isDisabled={isDisabled}
        >
          <Radio value="Ensino Medio">Ensino Médio</Radio>
          <Radio value="Universidade">Universidade</Radio>
          <Radio value="Cursinho">Cursinho</Radio>
        </RadioGroup>

        <TextArea
          name="delegate.currentYear"
          className='textarea-secondary-input-box'
          label="Ano em que está cursando:"
          aria-label="Ano em que está cursando"
          onChange={handleChange}
          defaultValue={defaultValues?.delegate?.currentYear}
          errorMessage={actionData?.errors?.currentYear}
          action={actionData}
          isDisabled={isDisabled}
        />
      </div>

      <div className='data-box-border' />
    </div>
  )
}

export default EducationLevel

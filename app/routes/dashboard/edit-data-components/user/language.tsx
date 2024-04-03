import React from 'react'

import { FiX } from 'react-icons/fi/index.js'
import { Item, Select } from '~/components/select'
import { Checkbox, CheckboxGroup } from '~/components/checkbox/checkbox-group';

const LanguageData = (props: any) => {
  const { defaultValues, isDisabled, handleChange, actionData, theme } = props

  return (
    <div className={`data-box-container ${theme ?? ""}`}>
      <h3 className="data-box-container-title blue-border">
        Idiomas que pode simular
      </h3>

      <div className='data-box-secondary-input-container' style={{ gap: 10 }}>
        <CheckboxGroup
          aria-label="Idiomas que pode simular"
          onChange={e => handleChange({ target: { name: "delegate.languagesSimulates", value: e.length === 0 ? null : e } })}
          name="languagesSimulates"
          isDisabled={isDisabled}
          errorMessage={actionData?.errors?.languagesSimulates}
          defaultValue={defaultValues?.delegate?.languagesSimulates}
          action={actionData}
        >
          <Checkbox value='Ingles' isDisabled={isDisabled}>Inglês</Checkbox>
          {defaultValues.participationMethod === "Universidade" ? <Checkbox value='Espanhol' isDisabled={isDisabled}>Espanhol</Checkbox> : <Checkbox value='Portugues' isDisabled={isDisabled}>Português</Checkbox>}
        </CheckboxGroup>
      </div>

      <div className='data-box-border' />
    </div>
  )
}

export default LanguageData
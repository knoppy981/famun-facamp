import React from 'react'

import { FiX } from 'react-icons/fi/index.js'
import { Item, Select } from '~/components/select'

const LanguageData = (props: any) => {
  const { formData, isDisabled, handleRemoveLanguage, handleAddLanguage, actionData, error } = props

  return (
    <div className={`data-box-container ${error ? "error" : ""}`}>
      <h3 className="data-box-container-title blue-border">

        Idiomas que pode simular
      </h3>

      {formData?.delegate?.languagesSimulates?.map((language: string, index: number) => (
        <div
          className={`data-box-checkbox-button ${isDisabled ? "disabled" : ""}`}
          key={index}
          onClick={() => !isDisabled ? handleRemoveLanguage(language) : null}
        >
          <div className={`data-box-checkbox-icon ${isDisabled ? "disabled" : ""}`}>
            <FiX />
          </div>

          <div className="data-box-checkbox-label">
            {language}
          </div>
        </div>
      ))}

      {!isDisabled &&
        <Select
          className='select-input-box'
          placeholder="Adicionar"
          name="language"
          hideLabel={true}
          onSelectionChange={value => !isDisabled ? handleAddLanguage(value) : null}
          selectedKey=""
          aria-label="Método de Participação"
          items={[
            { id: "Portugues" },
            { id: "Ingles" },
            { id: "Espanhol" }
          ]}
          errorMessage={actionData?.errors?.languagesSimulates}
          action={actionData}
          onChangeUpdateError={formData}
        >
          {(item) => <Item>{item.id}</Item>}
        </Select>
      }

      {error &&
        <p className="data-box-subtitle label error">
          {error}
        </p>
      }

      <div className='data-box-border' />
    </div>
  )
}

export default LanguageData
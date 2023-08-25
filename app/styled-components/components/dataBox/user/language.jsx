import React, { useEffect, useState, useRef } from 'react'

import * as S from "../elements"
import { FiX } from 'react-icons/fi'

const LanguageData = (props) => {

  const { formData, isDisabled, handleRemoveLanguage, handleAddLanguage, actionData } = props

  const [languageError, setLanguageError] = useState(null)

  useEffect(() => {
    setLanguageError(actionData?.errors?.languagesSimulates ?? null)
  }, [actionData])

  return (
    <S.Container>
      <S.ContainerTitle border="blue">
        Idiomas que pode simular
      </S.ContainerTitle>

      {formData?.delegate?.languagesSimulates?.map((language, index) => (
        <S.CheckboxButton
          key={`${formData?.id}-language-${index}`}
          disabled={isDisabled}
          onClick={() => !isDisabled ? handleRemoveLanguage(language) : null}
        >
          <S.CheckboxIcon disabled={isDisabled}>
            <FiX />
          </S.CheckboxIcon>

          <S.CheckboxLabel
            disabled={isDisabled}
          >
            {language}
          </S.CheckboxLabel>
        </S.CheckboxButton>
      ))}

      {!isDisabled && <S.Select
        name="languages"
        onChange={event => {
          event.target.value !== "Adicionar idioma" && !isDisabled ? handleAddLanguage(event) : null
          setLanguageError(null)
        }}
        defaultValue="Adicionar idioma"
        key={`${formData?.id}-languages`}
      >
        {[
          'Adicionar idioma',
          'Portugues',
          'Ingles',
          'Espanhol',
        ].map((language, index) => (
          <option
            key={`${formData?.id}-language-option-${index}`}
          >
            {language}
          </option>
        ))}
      </S.Select>}

      {languageError && <S.Error>{languageError}</S.Error>}
    </S.Container>
  )
}

export default LanguageData
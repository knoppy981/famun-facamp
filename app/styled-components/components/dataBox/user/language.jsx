import React, { useEffect, useState, useRef } from 'react'

import * as S from "../elements"
import { FiX } from 'react-icons/fi'
import DataChangeInputBox from '~/styled-components/components/inputBox/dataChange'
import { Select, Item } from '~/styled-components/components/select';

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

      <S.LanguageSelectContainer>
        {!isDisabled &&
          <Select
            placeholder="Adicionar Idioma"
            name="language"
            hideLabel={1}
            onSelectionChange={value => {
              !isDisabled ? handleAddLanguage(value) : null
              setLanguageError(null)
            }}
            selectedKey=""
            aria-label="Método de Participação"
            items={[
              { id: "Portugues" },
              { id: "Ingles" },
              { id: "Espanhol" }
            ]}
          >
            {(item) => <Item>{item.id}</Item>}
          </Select>
        }
      </S.LanguageSelectContainer>

      {languageError && <S.Error>{languageError}</S.Error>}
    </S.Container>
  )
}

export default LanguageData
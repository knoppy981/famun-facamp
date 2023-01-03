import { useState, useRef } from 'react'

import * as S from './elements'
import { FiTrash2 } from 'react-icons/fi'

const AdvisorData = ({ data }) => {
  const { council, language, role, ..._data } = data
  const [values, setValues] = useState(_data)
  const valuesArray = Object.entries(values)

  const inputRef = useRef(null)
  const [selectValue, setSelectValue] = useState("Instagram")

  const addSM = (e) => {
    e.preventDefault();
    if (inputRef?.current.value.length > 0) setValues({ ...values, [selectValue]: inputRef?.current.value })
  }

  const removeSM = (e, item) => {
    e.preventDefault();
    let copyOfValues = { ...values }
    delete copyOfValues[item]
    setValues(copyOfValues);
  }

  return (
    <>
      <S.Title>
        Dados do Orientador
      </S.Title>

      <S.Wrapper>
        <S.Container padding={valuesArray.length > 0}>
          <S.Label>
            Redes Sociais
          </S.Label>

          <S.SelectBox>
            <S.Select
              value={selectValue}
              onChange={e => {
                setSelectValue(e.target.value)
                inputRef.current.value = values[e.target.value] ?? inputRef.current.value
              }}
            >
              <S.Option>Instagram</S.Option>
              <S.Option>Facebook</S.Option>
              <S.Option>Linkedin</S.Option>
              <S.Option>Twitter</S.Option>
            </S.Select>

            <S.Input
              type="string"
              ref={inputRef}
              placeholder="nome de usuario"
            />

            <S.Button onClick={addSM}>
              {values.hasOwnProperty(selectValue) ? "Editar" : "Adicionar"}
            </S.Button>
          </S.SelectBox>

          <S.List>
            {valuesArray.map((item, index) => {
              const active = selectValue === item[0]
              return (
                <S.SocialMedias
                  first={index === 0}
                  key={`sm-${item[0]}`}
                  active={active}
                  onClick={() => setSelectValue(item[0])}
                >
                  <input type="hidden" name={item[0]} value={item[1]} />
                  <S.SMName>{item[0]}</S.SMName>
                  <S.SMValue>
                    {item[1]}
                  </S.SMValue>
                  <S.SMDeleteButton onClick={e => removeSM(e, item[0])}>
                    <FiTrash2 />
                  </S.SMDeleteButton>
                </S.SocialMedias>
              )
            })}
          </S.List>
        </S.Container>

        <S.Container>
          <S.Label>
            Posição do orientador
          </S.Label>

          <S.SelectBox>
            <S.AdvisorRoleSelect
              name="role"
              defaultValue={role}
            >
              <S.Option>Professor</S.Option>
              <S.Option>Coordenador</S.Option>
              <S.Option>Diretor</S.Option>
              <S.Option>Outro</S.Option>
            </S.AdvisorRoleSelect>
          </S.SelectBox>
        </S.Container>
      </S.Wrapper>
    </>
  )
}

export default AdvisorData
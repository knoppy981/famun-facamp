import { useState, useRef, useEffect } from 'react'

import * as S from './elements'
import { FiTrash2 } from 'react-icons/fi'
import SelectInput from '~/styled-components/components/inputs/selectInput'

const AdvisorData = ({ data, actionData }) => {

  const [values, setValues] = useState({
    Instagram: data?.Instagram,
    Facebook: data?.Facebook,
    Linkedin: data?.Linkedin,
    Twiteer: data?.Twitter
  })
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
      <S.TitleBox>
        <S.Title>
          Dados do(a) Professor(a) Orientador(a)
        </S.Title>
      </S.TitleBox>


      <S.Wrapper>
        <SelectInput
          name="role"
          text="Posição do(a) Professor(a) Orientador(a)"
          value={data?.role}
          selectList={["Professor(a)", "Coordenador(a)", "Diretor(a)", "Outro"]}
          err={actionData?.errors?.name}
        />

        <S.Container>
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

            <S.SelectBoxAuxDiv>
              <S.Input
                type="string"
                ref={inputRef}
                placeholder="nome de usuario"
                defaultValue={values[selectValue]}
              />

              <S.Button onClick={addSM}>
                {values[selectValue] !== undefined ? "Editar" : "Adicionar"}
              </S.Button>
            </S.SelectBoxAuxDiv>
          </S.SelectBox>

          <S.List>
            {valuesArray.map((item, index) => {
              const active = selectValue === item[0]
              if (item[1] === undefined) return
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
      </S.Wrapper>
    </>
  )
}

export default AdvisorData
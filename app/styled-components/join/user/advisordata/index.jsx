import { useState, useRef, useEffect } from 'react'

import * as S from './elements'
import { FiTrash2 } from 'react-icons/fi'
import SelectInput from '~/styled-components/components/inputs/selectInput'
import DefaultInputBox from '~/styled-components/components/inputs/defaultInput'

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
      <S.Title>
        Dados do(a) Professor(a) Orientador(a)
      </S.Title>

      <S.Wrapper>
        <S.InputContainer>
          <SelectInput
            name="role"
            text="Posição do(a) Professor(a) Orientador(a)"
            value={data?.role}
            selectList={["Professor(a)", "Coordenador(a)", "Diretor(a)", "Outro"]}
            err={actionData?.errors?.name}
          />

          <DefaultInputBox
            name="Instagram"
            text="Instagram"
            type="text"
            value={data?.Instagram}
            err={actionData?.errors?.Instagram}
          />

          <DefaultInputBox
            name="Facebook"
            text="Facebook"
            type="text"
            value={data?.Facebook}
            err={actionData?.errors?.Facebook}
          />

          <DefaultInputBox
            name="Linkedin"
            text="Linkedin"
            type="text"
            value={data?.Linkedin}
            err={actionData?.errors?.Linkedin}
          />
        </S.InputContainer>
      </S.Wrapper>
    </>
  )
}

export default AdvisorData
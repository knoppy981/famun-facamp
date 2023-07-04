import React from 'react'

import * as S from './elements'
import DefaultInputBox from "~/styled-components/components/inputs/defaultInput";
import SelectInput from '~/styled-components/components/inputs/selectInput';
import PhoneInputBox from '~/styled-components/components/inputs/defaultInput/phoneInput';

const CreateDelegation = ({ data, actionData }) => {
  return (
    <>
      <S.Title>
        Criar uma delegação
      </S.Title>

      <S.Wrapper>
        <S.InputContainer>
          <DefaultInputBox
            name="schoolName"
            text="Nome da Escola / Universidade"
            type="text"
            value={data?.schoolName}
            err={actionData?.errors?.schoolName}
            autoFocus={true}
          />

          <PhoneInputBox
            name="schoolPhoneNumber"
            text="Numero de Telefone da Escola / Universidade"
            type="text"
            value={data?.schoolPhoneNumber}
            err={actionData?.errors?.schoolPhoneNumber}
          />

          <SelectInput
            name="participationMethod"
            text="Método de participação"
            value={data?.participationMethod}
            selectList={["Presencial", "Online", "Ambos"]}
            err={actionData?.errors?.participationMethod}
          />
        </S.InputContainer>
      </S.Wrapper>
    </>
  )
}

export default CreateDelegation
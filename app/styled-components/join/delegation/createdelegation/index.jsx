import React from 'react'

import * as S from './elements'
import AuthInputBox from "~/styled-components/components/inputs/authInput";

const CreateDelegation = ({ data, actionData }) => {
  return (
    <>
      <S.Title>
        Criar uma delegação
      </S.Title>

      <S.InputContainer>
        <S.VerticalInputContainer>
          <AuthInputBox
            name="schoolName"
            text="Nome da Escola / Universidade"
            type="text"
            value={data?.schoolName}
            err={actionData?.errors?.schoolName}
            autoFocus={true}
          />

          <AuthInputBox
            name="schoolPhoneNumber"
            text="Numero de Telefone da Escola / Universidade"
            type="text"
            value={data?.schoolPhoneNumber}
            err={actionData?.errors?.schoolPhoneNumber}
          />
        </S.VerticalInputContainer>

        <S.Container>
          <S.SelectTitle>
            Método de participação
          </S.SelectTitle>

          <S.Select
            name="participationMethod"
          >
            <S.Option value={"Presencial"}>Presencial</S.Option>
            <S.Option value={"Online"}>Online</S.Option>
            <S.Option value={"Ambos"}>Ambos</S.Option>
          </S.Select>
        </S.Container>
      </S.InputContainer>
    </>
  )
}

export default CreateDelegation
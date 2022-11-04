import React from 'react'

import { useOutletContext } from '@remix-run/react'

import ProfileInputBox from '~/styled-components/components/profile-input-box'
import * as S from '~/styled-components/dashboard/profile/registration'

import { FiEdit } from 'react-icons/fi'

const resgitration = () => {

  const { user } = useOutletContext()

  return (
    <S.ItemContainer>
      <S.ContainerTitle>
        Dados Cadastrais
      </S.ContainerTitle>
      <S.InputWrapper>
        <S.FormContainer id="saveChanges">
          <ProfileInputBox
            text="E-mail"
            name="email"
            placeholder="Digite o novo e-mail"
            type="email"
            value={user.email}
            disabled={true}
          />

          <ProfileInputBox
            text="Nome"
            name="name"
            placeholder="Digite o novo nome"
            type="string"
            value={user.name}
          />
        </S.FormContainer>

        <S.PasswordBox>
          <S.PasswordTitle>
            Password
          </S.PasswordTitle>

          <S.Password>
            *************
          </S.Password>

          <S.PasswordEditButton>
            <FiEdit /> {" "} <p>Reset</p>
          </S.PasswordEditButton>
        </S.PasswordBox>

        <S.SaveChangesButton type="submit" disbaled={false} form="saveChanges">
          Salvar alterações
        </S.SaveChangesButton>
      </S.InputWrapper>
    </S.ItemContainer>

  )
}

export default resgitration
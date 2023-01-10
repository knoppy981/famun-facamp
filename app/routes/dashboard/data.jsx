import React from 'react'

import { useUser, useUserType } from '~/utils'

import * as S from '~/styled-components/dashboard/profile'
import { FiEdit } from 'react-icons/fi'

const data = () => {

  const { delegate, delegationAdvisor, ...data } = {
    ...useUser(),
    userType: useUserType()
  }
  console.log(delegate)
  console.log(delegationAdvisor)

  return (
    <S.Wrapper>
      <S.Title>
        Profile
      </S.Title>

      <S.Columns>
        <S.DataWrapper>
          <S.DataTitle>
            Dados pessoais <S.ColorItem><FiEdit />Editar</S.ColorItem>
          </S.DataTitle>

          <S.DataContainer>
            {[
              ["Name", "name"],
              ["Email", "email"],
              ["Phone Number", "phoneNumber"],
              ["Nacionality", "nacionality"],
              ["Date of Birth", "birthDate"],
              ["Cpf", "cpf"],
              ["Rg", "rg"],
            ].map((item, index) => (
              <>
                <S.Key key={`key-${item[0]}`}>
                  {item[0]}
                </S.Key>

                <S.Item key={`item-${item[0]}`} defaultValue={data[item[1]]} />
              </>
            ))}
          </S.DataContainer>
        </S.DataWrapper>

        <S.DataWrapper>
          {data.userType === 'delegate' ?
            <>
              <S.DataTitle>
                Dados de Delegado <S.ColorItem><FiEdit />Editar</S.ColorItem>
              </S.DataTitle>

              <S.ColumnDataContainer>
                <S.Key>
                  Preferencia de Conselho
                </S.Key>

                <S.Item defaultValue={delegate.councilPreference.replace(/[_]/g, ' ')} />
              </S.ColumnDataContainer>

              <S.ColumnDataContainer>
                <S.Key>
                  Idiomas fluentes
                </S.Key>

                {delegate.languagesSimulates.map((item, index) => (
                  <S.Item key={`language-${index}`} defaultValue={item.language} />
                ))}
              </S.ColumnDataContainer>
            </>
            :
            <>
              <S.DataTitle>
                Dados de Orientador <S.ColorItem><FiEdit />Editar</S.ColorItem>
              </S.DataTitle>

              <S.DataContainer>
                <S.Key>
                  Posição
                </S.Key>

                <S.Item defaultValue={delegationAdvisor.advisorRole} />

                {delegationAdvisor.socialMedia.map((item, index) => (
                  <>
                    <S.Key key={`social-media-${index}`}>
                      {item.socialMediaName}
                    </S.Key>

                    <S.Item key={`social-meida-username-${index}`} defaultValue={item.username} />
                  </>
                ))}
              </S.DataContainer>
            </>
          }
        </S.DataWrapper>
      </S.Columns>

    </S.Wrapper>
  )
}

export default data
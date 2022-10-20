import React from 'react'
import { NavLink, Outlet } from '@remix-run/react'

import { useUser } from '~/utils'

import * as S from '~/styled-components/dashboard/profile'

const profile = () => {

  const user = useUser()

  const linkStyles = [
    { opacity: 1 },
    { opacity: 0.4 }
  ]

  return (
    <S.Wrapper>
      <S.TitleBox>
        <S.Title>
          Ficha de Inscrição
        </S.Title>

        <S.SubTitle>
          {user.name}
        </S.SubTitle>
      </S.TitleBox>
      <S.Container>
        <S.ItemList>
          <NavLink
            to='/dashboard/profile/registration'
            style={({ isActive }) =>
              isActive ? linkStyles[0] : linkStyles[1]
            }
          >
            Dados Cadastrais
          </NavLink>

          <NavLink
            to='/dashboard/profile/info'
            style={({ isActive }) =>
              isActive ? linkStyles[0] : linkStyles[1]
            }
          >
            Dados Pessoais
          </NavLink>

          <NavLink
            to='/dashboard/profile/contact'
            style={({ isActive }) =>
              isActive ? linkStyles[0] : linkStyles[1]
            }
          >
            Informações para contato
          </NavLink>
        </S.ItemList>

        <S.ItemWrapper>
          <Outlet context={{user}}/>
        </S.ItemWrapper>
      </S.Container>
    </S.Wrapper>
  )
}

export default profile
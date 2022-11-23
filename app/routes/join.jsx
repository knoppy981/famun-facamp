import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";

import { getUserId } from "~/session.server";

import * as S from '~/styled-components/join'
import { FiSettings, FiHelpCircle, FiArrowLeft, } from "react-icons/fi";

const join = () => {
  return (
    <S.Wrapper>
      <S.Container>
        <S.TitleBox>
          <S.Title>
            FAMUN 2023
          </S.Title>

          <S.ArrowIconBox />

          <S.SubTitle>
            Inscrição
          </S.SubTitle>
        </S.TitleBox>

        <S.Navbar>
          <S.NavMenu>
            <Link to="/login">
              <S.NavItem active first>
                <FiArrowLeft />
                <p>Voltar</p>
              </S.NavItem>
            </Link>
          </S.NavMenu>

          <S.NavMenu>
            <S.NavItem first active>
              <FiHelpCircle />
              <p>Ajuda</p>
            </S.NavItem>

            <S.NavItem active>
              <FiSettings />
            </S.NavItem>
          </S.NavMenu>
        </S.Navbar>

        <S.StepsWrapper>
          <Outlet />
        </S.StepsWrapper>
      </S.Container>
    </S.Wrapper >
  )
}

export default join
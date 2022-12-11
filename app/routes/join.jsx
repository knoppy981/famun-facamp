import { Link, Outlet, useSearchParams } from "@remix-run/react";
import { json } from "@remix-run/node";

import { getUserId } from "~/session.server";

import * as S from '~/styled-components/join'
import { FiSettings, FiHelpCircle, FiArrowLeft, } from "react-icons/fi";

const join = () => {

  const [searchParams] = useSearchParams();

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
            <Link
              to={{
                pathname: "/login",
                search: searchParams.toString(),
              }}
            >
              <S.NavItem>
                <FiArrowLeft />
                Início
              </S.NavItem>
            </Link>
          </S.NavMenu>

          <S.NavMenu>
            <S.NavItem>
              <FiHelpCircle />
              Ajuda
            </S.NavItem>

            <S.NavItem border>
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
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
                <S.NavIcon>
                  <FiArrowLeft />
                </S.NavIcon>
                Início
              </S.NavItem>
            </Link>
          </S.NavMenu>

          <S.NavMenu>
            <S.NavItem>
              <S.NavIcon>
                <FiHelpCircle />
              </S.NavIcon>
              Ajuda
            </S.NavItem>

            <S.NavItem>
              <S.NavIcon>
                <FiSettings />
              </S.NavIcon>
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
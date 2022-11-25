import { redirect, json } from "@remix-run/node";
import { NavLink, Outlet } from "@remix-run/react";

import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

import * as S from '~/styled-components/dashboard'
import {
  FiMenu,
  FiShoppingBag,
  FiGlobe,
  FiLogOut,
  FiUser,
  FiUsers,
  FiCreditCard,
  FiBookmark,
  FiSettings,
  FiArchive,
  FiEdit,
  FiFlag,
  FiHome,
  FiHelpCircle,
  FiFile,
} from "react-icons/fi";

export const loader = async ({ request }) => {
  const userId = await requireUserId(request)
  return json({ userId })
};

const Dashboard = () => {

  const user = useUser()

  return (
    <S.Wrapper>
      <S.Container>
        <S.TitleBox>
          <S.Title>
            FAMUN 2023
          </S.Title>

          <S.ArrowIconBox />

          <S.SubTitle>
            Dashboard
          </S.SubTitle>
        </S.TitleBox>

        <S.Navbar>
          <S.NavItem>
            <FiUser />
            <p>{user.name}</p>
          </S.NavItem>

          <S.NavMenu>
            <S.NavItem>
              <FiHelpCircle />
              <p>Ajuda</p>
            </S.NavItem>

            <S.NavItem>
              <FiSettings />

              {/* <S.DropDownContainer>
                <S.DropDownMenu>
                  <S.DropDownTitleBox>

                  </S.DropDownTitleBox>

                  <S.DropDownItem>
                    <FiGlobe /> Pt - Br
                  </S.DropDownItem>

                  <S.DropDownItem>
                    <FiUsers /> Preferencias de Usuario
                  </S.DropDownItem>

                  <S.DropDownItem last>
                    <FiLogOut /> Logout
                  </S.DropDownItem>
                </S.DropDownMenu>
              </S.DropDownContainer> */}
            </S.NavItem>
          </S.NavMenu>
        </S.Navbar>

        <S.DashboardContainer>
          <S.Sidebar>
            <NavLink to="home">
              {({ isActive }) => (
                <S.SidebarItem active={isActive ? true : false}>
                  <S.ItemIcon>
                    <FiHome />
                  </S.ItemIcon>
                  <S.ItemTitle>
                    Início
                  </S.ItemTitle>
                </S.SidebarItem>
              )}
            </NavLink>

            <NavLink to="data" prefetch="render">
              {({ isActive }) => (
                <S.SidebarItem active={isActive ? true : false}>
                  <S.ItemIcon>
                    <FiEdit />
                  </S.ItemIcon>
                  <S.ItemTitle>
                    Dados Inscrição
                  </S.ItemTitle>
                </S.SidebarItem>
              )}
            </NavLink>

            <NavLink to="delegation" prefetch="intent">
              {({ isActive }) => (
                <S.SidebarItem active={isActive ? true : false}>
                  <S.ItemIcon>
                    <FiFlag />
                  </S.ItemIcon>
                  <S.ItemTitle>
                    Delegação
                  </S.ItemTitle>
                </S.SidebarItem>
              )}
            </NavLink>


            <NavLink to="payment" prefetch="render">
              {({ isActive }) => (
                <S.SidebarItem active={isActive ? true : false}>
                  <S.ItemIcon>
                    <FiCreditCard />
                  </S.ItemIcon>
                  <S.ItemTitle>
                    Pagamento
                  </S.ItemTitle>
                </S.SidebarItem>
              )}
            </NavLink>

            <NavLink to="documents">
              {({ isActive }) => (
                <S.SidebarItem active={isActive ? true : false}>
                  <S.ItemIcon>
                    <FiFile />
                  </S.ItemIcon>
                  <S.ItemTitle>
                    Documentos
                  </S.ItemTitle>
                </S.SidebarItem>
              )}
            </NavLink>
          </S.Sidebar>

          <S.OutletWrapper>
            <Outlet context={{ user }} />
          </S.OutletWrapper>
        </S.DashboardContainer>
      </S.Container>
    </S.Wrapper >
  )
}

export default Dashboard
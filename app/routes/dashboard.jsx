import { useRef, useState } from "react";
import { redirect, json } from "@remix-run/node";
import { NavLink, Outlet } from "@remix-run/react";

import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

import * as S from '~/styled-components/dashboard'
import * as D from '~/styled-components/components/dropdown'
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
import { useClickOutside } from "~/hooks/useClickOutside";

export const loader = async ({ request }) => {
  const userId = await requireUserId(request)
  return json({ userId })
};

const Dashboard = () => {

  const user = useUser()

  const menuRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)
  useClickOutside(menuRef, () => setMenuOpen(false))

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
            {user.name}
          </S.NavItem>

          <S.NavMenu>
            <S.NavItem>
              <S.NavIcon>
                <FiHelpCircle />
              </S.NavIcon>
              Ajuda
            </S.NavItem>

            <S.NavItem ref={menuRef} border>
              <S.NavIcon onClick={() => setMenuOpen(!menuOpen)} >
                <FiSettings />
              </S.NavIcon>

              <D.Reference open={menuOpen}/>
              <D.Container open={menuOpen}>
                <D.Menu>
                  <D.Item>
                    <FiGlobe /> Pt - Br
                  </D.Item>

                  <D.Item>
                    <FiUsers /> Preferencias de Usuario
                  </D.Item>

                  <D.DForm action="/logout" method="post">
                    <D.Item>
                      <D.Button type='submit'>
                        <FiLogOut /> Logout
                      </D.Button>
                    </D.Item>
                  </D.DForm>
                </D.Menu>
              </D.Container>
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

            <NavLink to="delegation" prefetch="render">
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
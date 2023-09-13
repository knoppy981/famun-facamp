import { json, redirect } from "@remix-run/node";
import { Form, NavLink, Outlet } from "@remix-run/react";
import { useTranslation } from "react-i18next";

import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

import * as S from '~/styled-components/dashboard'
import {
  FiMenu,
  FiLogOut,
  FiUser,
  FiCreditCard,
  FiFlag,
  FiHome,
  FiFile,
  FiEdit,
  FiX,
} from "react-icons/fi";
import SidebarTrigger from "~/styled-components/components/modalOverlay/sidebarTrigger";
import Button from "~/styled-components/components/button";
import LanguageMenu from "~/styled-components/components/languageMenu";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  if (url.pathname === "/dashboard") return redirect("/dashboard/home")

  const userId = await requireUserId(request)
  return json({ userId })
};

export const handle = {
  //handle the file it pulls to translate
  i18n: "dashboard"
};

const Dashboard = () => {

  const user = useUser()
  const { t } = useTranslation("dashboard")
  const menuItems = [
    { name: t("home"), to: "home", icon: <FiHome />, prefetch: "none" },
    { name: t("data"), to: "data", icon: <FiEdit />, prefetch: "render" },
    { name: t("delegation"), to: "delegation", icon: <FiFlag />, prefetch: "render" },
    { name: t("payments"), to: "payment", icon: <FiCreditCard />, prefetch: "render" },
    { name: t("documents"), to: "documents", icon: <FiFile />, prefetch: "none" },
  ]

  return (
    <S.Wrapper>
      <S.TitleBox>
        <S.Title>
          FAMUN 2023
        </S.Title>

        <S.AuxDiv>
          <S.ArrowIconBox />

          <S.SubTitle>
            Dashboard
          </S.SubTitle>
        </S.AuxDiv>
      </S.TitleBox>

      <S.Navbar>
        <S.NavItem disabled>
          <FiUser />

          <span>
            {user.name}
          </span>
        </S.NavItem>

        <S.DisappearOnWidth>
          <Form action='/logout' method='post'>
            <Button type='submit'>
              <S.NavItem>
                <FiLogOut />
                {t("log out")}
              </S.NavItem>
            </Button>
          </Form>
        </S.DisappearOnWidth>

        <S.DisappearOnWidth reverse>
          <SidebarTrigger label={<FiMenu style={{ fontSize: "2.4rem" }} />} isDismissable>
            {close =>
              <S.AsideContainer>
                <S.AsideNavbar>
                  Menu

                  <Button onPress={close}>
                    <FiX />
                  </Button>
                </S.AsideNavbar>

                <S.AsideLinkContainer>
                  {menuItems.map((item, index) => (
                    <NavLink
                      key={index}
                      tabIndex="0"
                      role="link"
                      aria-label={`${item.to}-link`}
                      to={item.to}
                      onClick={close}
                      prefetch={item.prefetch}
                    >
                      {({ isActive }) => (
                        <S.SidebarItem active={isActive ? true : false}>
                          {item.icon} {item.name}
                        </S.SidebarItem>
                      )}
                    </NavLink>
                  ))}
                </S.AsideLinkContainer>

                <Form action='/logout' method='post' onClick={close}>
                  <Button type='submit'>
                    <FiLogOut />
                    Log out
                  </Button>
                </Form>
              </S.AsideContainer>
            }
          </SidebarTrigger>
        </S.DisappearOnWidth>
      </S.Navbar>

      <S.DashboardContainer>
        <S.Sidebar>
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              tabIndex="0"
              role="link"
              aria-label={`${item.to}-link`}
              to={item.to}
              prefetch={item.prefetch}
            >
              {({ isActive }) => (
                <S.SidebarItem active={isActive ? true : false}>
                  {item.icon} {item.name}
                </S.SidebarItem>
              )}
            </NavLink>
          ))}
        </S.Sidebar>

        <S.OutletWrapper>
          <Outlet context={{ user }} />
        </S.OutletWrapper>
      </S.DashboardContainer>
    </S.Wrapper >
  )
}

export default Dashboard
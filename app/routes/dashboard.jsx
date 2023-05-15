import { useRef, useState } from "react";
import { json } from "@remix-run/node";
import { Form, NavLink, Outlet, useFetcher, useLocation } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";

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
  FiArrowLeft,
} from "react-icons/fi";

import { useClickOutside } from "~/hooks/useClickOutside";
import LanguageMenu from "~/styled-components/components/dropdown/languageMenu";

export const loader = async ({ request }) => {
  const userId = await requireUserId(request)
  return json({ userId })
};

export const handle = {
  //handle the file it pulls to translate
  i18n: "dashboard"
};

const Dashboard = () => {

  const user = useUser()

  /* const { t, i18n } = useTranslation("dashboard") */

  return (
    <S.Wrapper>
      <LanguageMenu /* i18n={i18n} */ />

      <S.Container>
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
          <S.NavItem>
            <FiUser />
            {user.name}
          </S.NavItem>

          <S.NavMenu>
            <Form action='/logout' method='post'>
              <S.NavItem type='submit'>
                <S.NavIcon>
                  <FiLogOut />
                </S.NavIcon>
                Log out
              </S.NavItem>
            </Form>
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
                    Home
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
                    Subscription Data
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
                    Delegation
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
                    Payments
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
                    Documents
                  </S.ItemTitle>
                </S.SidebarItem>
              )}
            </NavLink>
          </S.Sidebar>

          <S.OutletWrapper>
            <Outlet context={{ user }} />
          </S.OutletWrapper>
        </S.DashboardContainer>
      </S.Container >
    </S.Wrapper >
  )
}

export default Dashboard
import { useEffect, useRef, useState } from "react";
import { json, redirect } from "@remix-run/node";
import { Form, NavLink, Outlet, useFetcher, useLocation } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";

import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

import * as S from '~/styled-components/dashboard'
import * as D from '~/styled-components/components/dropdown/elements'
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
  FiX,
} from "react-icons/fi";

import { useClickOutside } from "~/hooks/useClickOutside";
import LanguageMenu from "~/styled-components/components/dropdown/languageMenu";

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

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  // cancel scroll when sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
  }, [isSidebarOpen])

  const sidebarVariants = {
    enter: {
      x: "100%",
      opacity: 0
    },
    center: {
      x: 0,
      opacity: 1
    },
    exit: {
      x: "100%",
      opacity: 0
    }
  };
  const blurVariants = {
    enter: {
      opacity: 0
    },
    center: {
      opacity: 1
    },
    exit: {
      opacity: 0
    }
  };

  /* const { t, i18n } = useTranslation("dashboard") */

  return (
    <S.Wrapper>
      <LanguageMenu /* i18n={i18n} */ />

      <AnimatePresence initial={false} mode="wait">
        {isSidebarOpen && <S.BlurWrapper
          key="blurWrapper"
          variants={blurVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: .3, ease: "easeInOut" }}
          onClick={toggleSidebar}
        />}

        {isSidebarOpen && <S.Aside
          key="sidebar"
          variants={sidebarVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: .3, ease: "easeInOut" }}
        >
          <S.AsideContainer>
            <S.AsideNavbar>
              <S.TitleBox>
                <S.SubTitle>
                  Menu
                </S.SubTitle>
              </S.TitleBox>

              <S.AsideCloseIcon onClick={toggleSidebar}>
                <FiX />
              </S.AsideCloseIcon>
            </S.AsideNavbar>

            {[
              { name: "Home", to: "home", icon: <FiHome />, prefetch: "none" },
              { name: "Profile", to: "data", icon: <FiEdit />, prefetch: "render" },
              { name: "Delegation", to: "delegation", icon: <FiFlag />, prefetch: "render" },
              { name: "Payments", to: "payment", icon: <FiCreditCard />, prefetch: "render" },
              { name: "Documents", to: "documents", icon: <FiFile />, prefetch: "none" },
            ].map((item, index) => (
              <NavLink to={item.to} onClick={toggleSidebar} prefetch={item.prefetch} key={`${item.to}-link`}>
                {({ isActive }) => (
                  <S.SidebarItem active={isActive ? true : false}>
                    <S.ItemIcon>
                      {item.icon}
                    </S.ItemIcon>
                    <S.ItemTitle>
                      {item.name}
                    </S.ItemTitle>
                  </S.SidebarItem>
                )}
              </NavLink>
            ))}

            <S.AsideLogout>
              <Form action='/logout' method='post' onClick={toggleSidebar}>
                <S.Button>
                  <S.NavItem type='submit'>
                    <FiLogOut />
                    Log out
                  </S.NavItem>
                </S.Button>
              </Form>
            </S.AsideLogout>
          </S.AsideContainer>
        </S.Aside>}
      </AnimatePresence>

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
          <S.NavItem disabled>
            <FiUser />

            <span>
              {user.name}
            </span>
          </S.NavItem>

          <S.DisappearOnWidth>
            <Form action='/logout' method='post'>
              <S.Button type='submit'>
                <S.NavItem>
                  <FiLogOut />
                  Log out
                </S.NavItem>
              </S.Button>
            </Form>
          </S.DisappearOnWidth>

          <S.DisappearOnWidth reverse>
            <S.NavItem onClick={toggleSidebar}>
              <FiMenu style={{ fontSize: "2.4rem" }} />

            </S.NavItem>
          </S.DisappearOnWidth>
        </S.Navbar>

        <S.DashboardContainer>
          <S.Sidebar>
            {[
              { name: "Home", to: "home", icon: <FiHome />, prefetch: "none" },
              { name: "Profile", to: "data", icon: <FiEdit />, prefetch: "render" },
              { name: "Delegation", to: "delegation", icon: <FiFlag />, prefetch: "render" },
              { name: "Payments", to: "payment", icon: <FiCreditCard />, prefetch: "render" },
              { name: "Documents", to: "documents", icon: <FiFile />, prefetch: "none" },
            ].map((item, index) => (
              <NavLink to={item.to} prefetch={item.prefetch} key={`${item.to}-link`}>
                {({ isActive }) => (
                  <S.SidebarItem active={isActive ? true : false}>
                    <S.ItemIcon>
                      {item.icon}
                    </S.ItemIcon>
                    <S.ItemTitle>
                      {item.name}
                    </S.ItemTitle>
                  </S.SidebarItem>
                )}
              </NavLink>
            ))}
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
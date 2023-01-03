import { useRef, useState } from "react";
import { json } from "@remix-run/node";
import { NavLink, Outlet, useFetcher, useLocation } from "@remix-run/react";
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
import br from '~/images/flag-icons/br.svg'
import de from '~/images/flag-icons/de.svg'
import es from '~/images/flag-icons/es.svg'
import fr from '~/images/flag-icons/fr.svg'
import mx from '~/images/flag-icons/mx.svg'
import pt from '~/images/flag-icons/pt.svg'
import us from '~/images/flag-icons/us.svg'
import { useClickOutside } from "~/hooks/useClickOutside";

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

  const { t, i18n } = useTranslation("dashboard")
  const lngs = i18n.options.supportedLngs.slice(0,-1)

  const { pathname } = useLocation()
  const updateI18n = useFetcher()

  const handleLanguage = async (e) => {
    e.preventDefault();
    i18n.changeLanguage(e.target.value);
    updateI18n.submit(
      { locale: e.target.value, url: pathname },
      { method: "post", action: "/api/updateI18n" }
    );
  }

  const menuRef = useRef(null)
  const dropDownRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuHeight, setMenuHeight] = useState(dropDownRef.current?.firstChild.offsetHeight)
  const [activeMenu, setActiveMenu] = useState("main")
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
            {t("title")}
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
              {t("help")}
            </S.NavItem>

            <S.NavItem ref={menuRef} border>
              <S.NavIcon onClick={() => setMenuOpen(!menuOpen)} >
                <FiSettings />
              </S.NavIcon>

              <D.Reference open={menuOpen} key="menu-reference" />
              <D.Container open={menuOpen} style={{ height: menuHeight }} key="menu">
                <AnimatePresence initial={false} mode="wait">
                  <motion.div
                    ref={dropDownRef}
                    key={activeMenu}
                    initial={{ x: activeMenu === "main" ? "-40%" : "40%", opacity: 0 }}
                    animate={{ x: "0", opacity: 1 }}
                    exit={{ x: activeMenu === "main" ? "-40%" : "40%", opacity: 0 }}
                    transition={{ duration: .4, ease: "easeInOut" }}
                    onAnimationStart={() => { if (menuOpen) setMenuHeight(dropDownRef?.current.offsetHeight) }}
                  >
                    <D.Menu key="main" active={activeMenu === "main"}>
                      <D.Item onClick={() => setActiveMenu("language")}>
                        <FiGlobe /> {t("changeLng")}
                      </D.Item>

                      <D.Item>
                        <FiUsers /> {t("preferences")}
                      </D.Item>

                      <D.DForm action="/logout" method="post">
                        <D.Item>
                          <D.Button type='submit'>
                            <FiLogOut /> {t("logOut")}
                          </D.Button>
                        </D.Item>
                      </D.DForm>
                    </D.Menu>

                    <D.Menu key="language" active={activeMenu === "language"}>
                      <D.Item noHover onClick={() => setActiveMenu("main")}>
                        <FiArrowLeft /> {t("return")}
                      </D.Item>

                      {lngs.map((item) => (
                        <D.Item>
                          <D.Button onClick={handleLanguage} value={item} key={`${item}-language-item`}>
                            <D.NacionalityFlag
                              style={{
                                backgroundImage: `url(/flag-icons/${[item]}.svg)`,
                              }}
                            />
                            {item}
                          </D.Button>
                        </D.Item>
                      ))}

                    </D.Menu>
                  </motion.div>
                </AnimatePresence>
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
                    {t("home")}
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
                    {t("data")}
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
                    {t("delegation")}
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
                    {t("payments")}
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
                    {t("documents")}
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
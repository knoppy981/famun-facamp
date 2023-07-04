import styled from "styled-components";
import { FiChevronRight } from "react-icons/fi";
import { Form } from "@remix-run/react";
import { motion } from "framer-motion";

const azulClaro = '#BDE8F5'
const azul = '#01558A'
const azulCeu = '#14A7D8'
const azulEscuro = '#183567'
const azulBackground = "#EDF9FC"
const color1 = "#1C2D38"
const color2 = "#011E2B"

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`
export const BlurWrapper = styled(motion.div)`
  position: fixed;
  z-index: 998;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
`
export const Aside = styled(motion.aside)`
  position: fixed;
  z-index: 999;
  width: 65%;
  height: 100%;
  top: 0;
  right: 0;
  background: #FAFAFA;
`
export const AsideContainer = styled.div`
  height: calc(100% - 100px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  margin: 50px 0;
  padding: 0 15px;

  a {
    width: 100%;
  }
`
export const AsideNavbar = styled.div`
  width: 100%;
	display: flex;
  justify-content: space-between;
  align-items: center;
`
export const AsideCloseIcon = styled.div`
  color: #000;
  cursor: pointer;
  outline: none;

  svg {
    font-size: 2.4rem;
  }
`
export const AsideLogout = styled.div`
  width: 100%;
  display: flex;
  padding: 15px;
	height: 40px;
  margin: auto 0 0;
`
export const Container = styled.div`
  position: relative;
  min-height: 85svh;
  margin: 10vh 0 5vh;
 	width: 80%;
  display: flex;
  flex-direction: column;
  gap: 40px;
  
  @media screen and (max-width: 500px) and (min-height: 700px) {
    gap: 20px;
    margin: 50px 0 50px;
    width: 100vw;
	}
`
export const TitleBox = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  
  @media screen and (max-width: 800px) {
    height: auto;
  }

  @media screen and (max-width: 500px) {
    height: auto;
    flex-direction: column;
    align-items: flex-start;
    width: auto;
    margin-left: 0;
    margin-right: auto;
    padding: 0 15px;
  }

  @media screen and (max-width: 350px) {
    height: auto;
    width: 100vw;
  }
`
export const AuxDiv = styled.div`
  align-items: center;
  display: flex;
`
export const Title = styled.div`
  font-size: 3.6rem;
  font-weight: 900;
  color: #183567;
  margin-right: 5px;

  @media screen and (max-width: 800px) {
    font-size: 4.2rem;
  }

  @media screen and (max-width: 500px) {
    font-size: 4.8rem;
  }

  @media screen and (max-width: 350px) {
    font-size: 3rem;
  }

  @media screen and (max-width: 500px) and (min-height: 700px) {
    display: none;
	}
`
export const SubTitle = styled.div`
  font-size: 2.4rem;
  font-weight: 500;
  color: #000;
  transform: translate(0, 1px);

  @media screen and (max-width: 800px) {
    font-size: 2.8rem;
  }

  @media screen and (max-width: 500px) {
    font-size: 3.2rem;
  }

  @media screen and (max-width: 350px) {
    font-size: 3rem;
  }
`
export const ArrowIconBox = styled(FiChevronRight)`
  height: 25px;
  width: 25px;
  color: #000;
  display: flex;
  align-items: bottom;

  @media screen and (max-width: 500px) and (min-height: 700px) {
    display: none;
	}
`
export const Navbar = styled.div`
  position: relative;
	min-height: 70px;
  width: 100%;
	display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #E6E6E6;
  gap: 10px;
  padding: 0 15px;
  background: #fff;

  @media screen and (max-width: 500px) and (min-height: 700px) {
    min-height: 45px;
    top: 0;
    position: sticky;
    z-index: 99;
    align-self: start;
	}
`
export const DisappearOnWidth = styled.div`
  display: ${p => p.reverse ? "none" : "block"};

  @media screen and (max-width: 700px) {
    display: ${p => p.reverse ? "block" : "none"};
  }
`
export const NavItem = styled.button`
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.8rem;
  flex: 1 0;
  min-width: 0;

  span {
    font-size: 1.8rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  svg {
    flex-shrink: 0;
    transform: translateY(-1px);
  }
`
export const NavIcon = styled.div`
  display: flex;
  align-items: center;
`
export const DashboardContainer = styled.div`
  display: flex;
  gap: 20px;
  width: 100%;

  @media screen and (max-height: 700px) {
    margin: 0;
	}

  @media screen and (max-width: 700px) {
    margin-top: 0;
	  display: block;
  }
`
export const Sidebar = styled.div`
  flex: 0 0;
  position: sticky;
  top: 40px;
  align-self: start;
	display: flex;
	flex-direction: column;
  align-items: center;
  gap: 15px;
  width: 100%;

  a {
    width: 100%;
  }

  @media screen and (max-width: 700px) {
    display: none;
  }
`
export const SidebarItem = styled.div`
  position: relative;
  display: flex;
	align-items: center;
	gap: 15px;
  padding: 15px;
	height: 40px;
  width: 100%;
  border-radius: 5px;
  transition: all .4s ease;
  transform: ${p => p.active && 'translateX(10px)'};

  --_p: ${p => p.active ? '#000' : undefined};

  &:hover {
    --_p: #000;
    transform: translateX(10px);
  }

  &::before {
    position: absolute;
    content: '';
    top: 50%;
    left: 0px;
    transform: translateY(-50%);
    height: 4px;
    width: 4px;
    border-radius: 2px;
    transition: background .3s;
    background: var(--_p, transparent);
  }
`
export const ItemIcon = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 1.8rem;
`
export const ItemTitle = styled.div`
	font-size: 1.6rem;
`
export const OutletWrapper = styled.div`
  padding: 0 40px;
  flex: 1 0;
  min-width: 0;

  @media screen and (max-width: 700px) {
    padding: 0;
  }
`

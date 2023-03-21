import styled from "styled-components";
import { FiChevronRight } from "react-icons/fi";
import { Form } from "@remix-run/react";

const azulClaro = '#BDE8F5'
const azul = '#01558A'
const azulCeu = '#14A7D8'
const azulEscuro = '#183567'
const azulBackground = "#EDF9FC"
const color1 = "#1C2D38"
const color2 = "#011E2B"

export const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`
export const Container = styled.div`
  width: 90%;
  height: 70vh;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0 30px;

  @media screen and (max-height: 700px) {
    height: 75vh;
	}
`
export const TitleBox = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  width: 426px;

  @media screen and (max-width: 500px) {
    height: auto;
    flex-direction: column;
    align-items: flex-start;
  }
`
export const AuxDiv = styled.div`
  align-items: center;
  display: flex;
`
export const Title = styled.div`
  font-size: 36px;
  font-weight: 900;
  color: ${azulEscuro};
  margin-right: 5px;
`
export const SubTitle = styled.div`
  font-size: 24px;
  font-weight: 500;
  color: #000;
  transform: translate(0, 1px);
`
export const ArrowIconBox = styled(FiChevronRight)`
  height: 25px;
  width: 25px;
  color: #000;
  display: flex;
  align-items: bottom;
`
export const Navbar = styled.div`
	min-height: 70px;
  width: 100%;
	display: flex;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #E6E6E6;
  padding: 0 15px;
  margin: 20px 0;

  @media screen and (max-width: 1200px) {
    margin-top: 0;
	}

  @media screen and (max-height: 600px) {
    min-height: 50px;
	}
`
export const NavMenu = styled.div`
  height: 50%;
  display: flex;
`
export const NavItem = styled.button`
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.8rem;
  padding: 0 15px;
  cursor: pointer;

  svg {
    transform: translateY(-1px);
  }
`
export const NavIcon = styled.div`
  display: flex;
  align-items: center;
`
export const DashboardContainer = styled.div`
	display: grid;
	grid-template-columns: 1fr 4fr;
  grid-gap: 20px;

  @media screen and (max-height: 600px) {
    padding: 40px 0 0;
	}
`
export const Sidebar = styled.div`
	display: flex;
	flex-direction: column;
  align-items: center;
  gap: 15px;
  width: 100%;

  a {
    width: 100%;
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
  padding: 5px;
  padding: 0 40px;

`

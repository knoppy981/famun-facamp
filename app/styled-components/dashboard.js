import styled from "styled-components";
import { FiChevronRight } from "react-icons/fi";

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
  height: 80%;
  display: flex;
  flex-direction: column;
  padding: 30px;
`
export const TitleBox = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 40px;
  height: 40px;
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
`
export const NavMenu = styled.div`
  display: flex;
  gap: 35px;
  height: 100%;
`
export const NavItem = styled.div`
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;

  p {
    transform: translateY(2px);
  }

  svg {
    height: 20px;
    width: 20px;
  }
`
export const DropDownContainer = styled.div`
  position: absolute;
  z-index: 1;
  top: calc(100% - 5px);
  right: -20px;
  width: 300px;
  background: ${azulBackground};
  box-shadow: 0px 2px 5px -2px #000000;
  border-radius: 10px;

  &::before {
    content: '';
    position: absolute;
    top: -5px;
    right: 25px;
    height: 10px;
    width: 10px;
    background: ${azulBackground};
    transform: rotate(45deg)
  }
`
export const DropDownMenu = styled.ul`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
`
export const DropDownTitleBox = styled.div`
  width: 100%;
  height: 100px;
  border-radius: 10px;
  background: ${azulClaro};
  box-shadow: 0px 2px 5px -2px #000000;
  display: flex;
  align-items: center;
  justify-content: center;
`
export const DropDownItem = styled.li`
  position: relative;
  height: 100%;
  padding-left: 5px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  color: #000;
  
  svg {
    height: 18px;
    width: 18px;
  }

  ${p => p.last && "padding-top: 20px; border-top: 1px solid #E6E6E6"}
`
export const DashboardContainer = styled.div`
	display: grid;
	grid-template-columns: 1fr 3.5fr;
  padding: 40px 0;
  grid-gap: 40px;
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
  display: flex;
	align-items: center;
	gap: 15px;
  padding: 15px;
	height: 40px;
  width: 100%;
  border-radius: 5px;
  transition: all .4s ease;
  background: ${p => p.active ? azulClaro : "transparent"};
  box-shadow: ${p => p.active ? "0px 2px 5px -2px #000000" : "none"};

`
export const ItemIcon = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 18px;
`
export const ItemTitle = styled.div`
	font-size: 16px;
`
export const OutletWrapper = styled.div`
  height: 100%;
  width: 100%;
  padding: 0 40px;
`

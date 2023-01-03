import styled from "styled-components";
import { FiChevronRight } from "react-icons/fi";
import { Form } from "@remix-run/react";

const azulClaro = '#BDE8F5'
const azul = '#01558A'
const azulCeu = '#14A7D8'
const azulEscuro = '#183567'
const azulBackground = "#EDF9FC"

export const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`
export const Container = styled.div`
  width: 70%;
  height: 80vh;
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
  font-size: 3.6rem;
  font-weight: 900;
  color: ${azulEscuro};
  margin-right: 5px;
`
export const SubTitle = styled.div`
  font-size: 2.4rem;
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
  height: 50%;
  display: flex;
`
export const NavItem = styled.div`
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.8rem;
  padding: 0 15px;
`
export const NavIcon = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;
`
export const StepsWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 10px;
`
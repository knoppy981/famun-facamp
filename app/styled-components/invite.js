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
  gap: 20px;
`
export const TitleBox = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
`
export const Title = styled.div`
  font-size: 3.6rem;
  font-weight: 900;
  color: ${azulEscuro};
  margin-right: 5px;
`
export const Subtitle = styled.div`
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
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
`
export const NavMenu = styled.div`
  display: flex;
`
export const NavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.8rem;
  padding: 0 15px;
  border-left: ${p => p.border ? '1px solid #E6E6E6' : undefined};
`
export const StepsForm = styled(Form)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  padding-left: 5px;
`
export const FormTitle = styled.h3`
  font-size: 2rem;
  font-weight: 500;
  color: #000;
`
export const FormSubtitle = styled.p`
  font-size: 1.8rem;
  color: #000;
`
export const Button = styled.button`
  height: 45px;
  width: 200px;
  margin-top: 40px;
  background: ${azulClaro};
  box-shadow: 0px 2px 5px -2px #000000;
  color: #000;
  border-radius: 5px;
	font-size: 1.5rem;
  transition: .4s all ease;
`
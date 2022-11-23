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
  width: 90%;
  height: 80vh;
  display: flex;
  flex-direction: column;
  padding: 30px;
  gap: 40px;
`
export const TitleBox = styled.div`
  display: flex;
  align-items: center;
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
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #E6E6E6;
`
export const NavMenu = styled.div`
  display: flex;
`
export const NavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  padding: 0 15px;
  border-left: ${p => p.first ? undefined : '1px solid #E6E6E6'};

  p {
    display: ${p => p.active ? "block" : 'none'};
  }
  svg {
    height: 20px;
    width: 20px;
  }
`
export const StepIndex = styled.div`
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${p => p.active ? 1 : .4};
`
export const StepsWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 10px;
  margin-top: -20px;
`
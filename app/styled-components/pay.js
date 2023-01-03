import styled from "styled-components";
import { Form } from "@remix-run/react";
import { FiChevronRight } from "react-icons/fi";

const azulClaro = '#BDE8F5'
const azulEscuro = '#183567'

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
export const DashboardContainer = styled.div`
	display: grid;
	grid-template-columns: 1fr 3.5fr;
  padding: 40px 0;
  grid-gap: 40px;
`
export const StepsForm = styled(Form)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
`
export const Grid = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: 4fr 1fr;
`
export const PriceContainer = styled.div`
  place-self: end;
`
export const PriceList = styled.div`
  margin-right: 0;
  margin-left: auto;
  display: flex;
  flex-direction: column-reverse;
`
export const PriceItem = styled.div`
  margin-right: 0;
  margin-left: auto;
  font-size: 1.6rem;
  padding: 0 10px;
  border-bottom: ${p => p.first && "1px solid #a7a7a7"};
`
export const Price = styled.h2`
  font-size: 3.6rem;
  font-weight: 900;
  color: ${azulEscuro};
`
export const ControlButtonsContainer = styled.div`
  margin: auto 0 0;
  display: flex;
  gap: 15px;
`
export const ControlButton = styled.button`
  height: 45px;
  width: 150px;
  background: ${p => !p.prev ? azulClaro : "transparent"};
  box-shadow: 0px 2px 5px -2px #000000;
  border: 1px solid ${p => !p.prev ? 'transparent' : '#E6E6E6'};
  color: #000;
  border-radius: 5px;
	font-size: 1.5rem;
  transition: .4s all ease;
`
export const Error = styled.div`
  height: 45px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.4rem;
  color: #d61f0a;
`
export const OutletContainer = styled.div`
  max-width: 600px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

import styled from "styled-components";
import { Form, Link } from "@remix-run/react";
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
export const ExternalButtonWrapper = styled.div`
  position: absolute;
  left: 5%;
  top: 5%;
  height: 40px;
`
export const ExternalButton = styled(Link)`
  border: 0;
  outline: none;
  display: flex;
  gap: 10px;
  font-size: 1.6rem;
  cursor: pointer;

  svg {
    font-size: 2rem;
    transform: translateY(1px);
  }
`
export const Container = styled.div`
  min-width: 400px;
  height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
`
export const TitleBox = styled.div`
  display: flex;
  align-items: center;
  min-width: 400px;
  height: 40px;
`
export const Title = styled.div`
  font-size: 3.6rem;
  font-weight: 900;
  color: #183567;
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
export const StepsForm = styled(Form)`
  height: calc(70vh - 80px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
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

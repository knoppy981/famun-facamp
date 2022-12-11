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
  font-size: 1.8rem;
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
export const StepsForm = styled(Form)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
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
export const StepTitle = styled.h3`
  font-size: 2.2rem;
  font-weight: 500;
  color: #000;
  padding-left: 5px;
`
export const StepSubtitle = styled.p`
  font-size: 1.4rem;
  color: #000;
`
export const InputContainer = styled.div`
  max-width: 900px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 10px;
`
export const SubInputContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`
// join delegation
export const JoinDelegationContainer = styled.div`
  margin: 30px 0 0 0;
  display: flex;
  align-items: center;
	grid-gap: 5px;
`
export const JoinDelegationLabel = styled.label`
	font-size: 1.8rem;
  display: flex;
  align-items: center;
  padding: 0 10px; 
  transition: .4s ease-in-out;
  color: ${props => props.focus ? '#2B5EB6' : '#000'};
`
export const JoinDelegationInputBox = styled.div`
  padding: 0 10px;
  width: 150px;
  height: 45px;
  border: 1px solid #E6E6E6;
  border-radius: 5px;
  display: flex;
`
export const JoinDelegationIcon = styled.div`
  height: 100%;
  margin-left: auto;
  margin-right: 0;
  display: flex;
  align-items: center;
  padding-left: 10px;

  svg {
    color: ${p => p.color};
    height: 22px;
    width: 22px;
  }
`
export const JoinDelegationInput = styled.input`
  width: 100%;
  height: 45px;
  outline: none;
  border: none;
  font-size: 1.8rem;
  font-weight: 400;
  background: transparent;
  color: #000;

  -webkit-text-fill-color: #000 !important;
`
export const JoinDelegationButton = styled.button`
  height: 45px;
  width: 150px;
  background: ${azulClaro};
  border-radius: 5px;
	font-size: 1.5rem;
  transition: .4s all ease;
  box-shadow: 0px 1px 5px -2px #000000;
  margin-left: 25px;

  &:disabled {
    color: #666666;
    background: transparent;
    cursor: not-allowed;
  }
  &:hover {
  }
`
export const joinDelegationStatus = styled.div`
  margin-top: 5px;
  padding-left: 10px;
  font-size: 1.6rem;
  color: #666666;
`
// confirm
export const ConfirmList = styled.div`
  display: flex;
  max-width: 1000px;
  gap: 80px;
  margin-top: 15px;
  padding-left: 10px;
`
export const ConfirmColumn = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 250px;
  overflow-x: hidden;
`
export const ConfirmItem = styled.li`
  font-size: 1.5rem;
`
export const ConfirmLabel = styled.div`
  font-size: 1.2rem;
  color: #666666;
`

export const StepButtonsContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 25px;
`
export const StepButton = styled.button`
  height: 45px;
  width: 250px;
  background: ${azulClaro};
  border-radius: 5px;
	font-size: 1.5rem;
  transition: .4s all ease;
  box-shadow: 0px 2px 5px -2px #000000;

  &:disabled {
    color: #666666;
  }
  &:hover {
    transform: translateY(-2px);
  }
`

import styled from "styled-components";
import { FiChevronRight } from "react-icons/fi";
import { Form, Link } from "@remix-run/react";

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
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  padding-left: 5px;
`
export const FormTitle = styled.h3`
  width: 426px;
  font-size: 2.2rem;
  font-weight: 500;
  color: #000;
`
export const FormSubTitle = styled.p`
  width: 426px;
  font-size: 1.4rem;
  color: #000;
`
export const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 25px;
`
export const Button = styled.button`
  height: 45px;
  width: 205px;
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
export const AccountLink = styled(Link)`
  height: 45px;
  width: 205px;
  display: grid;
  place-content: center;
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
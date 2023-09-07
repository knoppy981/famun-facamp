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
export const GoBackLinkWrapper = styled.div`
  position: absolute;
  left: 5%;
  top: 5%;
  height: 40px;
  font-size: 1.6rem;
`
export const Container = styled.div`
  min-height: 70svh;
  margin: 15vh 0;
 	width: 400px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  
  @media screen and (max-width: 500px) and (min-height: 700px) {
    gap: 20px;
    margin: 100px 0 50px;
    width: 100vw;
    padding: 0 15px;
	}
`
export const Title = styled.div`
  font-size: 3.6rem;
  font-weight: 900;
  color: #183567;
  margin-right: 5px;
  display: flex;
  justify-content: center;

  @media screen and (max-width: 800px) {
    font-size: 4.2rem;
  }

  @media screen and (max-width: 500px) {
    font-size: 4.8rem;
  }

  @media screen and (max-width: 350px) {
    font-size: 3rem;
  }
`
export const InviteForm = styled(Form)`
  width: 100%;
  color: #fff;
  display: flex;
  flex-direction: column;
	grid-gap: 15px;
`
export const FormTitle = styled.h3`
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
  margin-top: auto;
  margin-bottom: 0;
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 15px;
  margin-top: 40px;

  > * {
    width: 100%;
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
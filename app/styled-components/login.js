import styled from "styled-components";
import { Link, Form } from '@remix-run/react'
import { FiChevronRight } from "react-icons/fi";

const azulClaro = '#BDE8F5'
const azul = '#01558A'
const azulCeu = '#14A7D8'
const azulEscuro = '#183567'
const verde = '#3FA534'
const vermelho = '#C01627'

export const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`
export const FormContainer = styled.div`
	width: 400px;

	@media screen and (max-width: 1100px) {
	}
`
export const TitleBox = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 40px;
  height: 40px;
  width: 426px;
  
  @media screen and (max-width: 800px) {
    height: auto;
    width: 500px;
  }

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
  font-size: 3.6rem;
  font-weight: 900;
  color: #183567;
  margin-right: 5px;

  @media screen and (max-width: 800px) {
    font-size: 4.2rem;
  }

  @media screen and (max-width: 500px) {
    font-size: 5.2rem;
  }
`
export const SubTitle = styled.div`
  font-size: 2.4rem;
  font-weight: 500;
  color: #000;
  transform: translate(0, 1px);

  @media screen and (max-width: 800px) {
    font-size: 2.8rem;
  }

  @media screen and (max-width: 500px) {
    font-size: 3.4rem;
  }
`
export const ArrowIconBox = styled(FiChevronRight)`
  height: 25px;
  width: 25px;
  color: #000;
  display: flex;
  align-items: bottom;
`
export const AuthForm = styled(Form)`
	width: 100%;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
	grid-gap: 15px;
  margin-bottom: 40px;

`
export const ButtonContainer = styled.div`
	margin-top: 30px;
	width: 100%;
	height: 45px;
  display: flex;
  justify-content: center;
	align-items: center;

	@media screen and (max-width: 800px) {
		grid-template-columns: 1fr 2fr 1fr;
	}
`
export const SubmitButton = styled.button`
	border-radius: 5px;
	width: 300px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${azulClaro};
  gap: 15px;
  border-radius: 5px;
  box-shadow: 0px 2px 5px -2px #000000;
	height: 100%;
	cursor: pointer;
  transition: 0.4s all ease;
  color: #000;
  font-weight: 400;
	font-size: 1.5rem;

  &:disabled {
    color: #666666;
  }

  &:hover {
    transform: translateY(-2px);
  }

`
export const ForgotLinkBox = styled.div`
  color: #000;
  width: 100%;
  display: flex;
`
export const JoinLinkBox = styled.div`
	font-size: 1.4rem;
  color: #000;
  width: 100%;
  display: flex;
  justify-content: center;
`
export const StyledLink = styled(Link)`
  font-size: 1.4rem;
  height: 19px;
  margin-left: 5px;
  text-decoration: underline;
`
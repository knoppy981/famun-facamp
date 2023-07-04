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
  display: flex;
  align-items: center;
  justify-content: center;
`
export const FormContainer = styled.div`
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
export const AuthForm = styled(Form)`
	width: 100%;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
	grid-gap: 15px;
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

  @media screen and (max-width: 500px) and (min-height: 700px) {
    margin-top: 60px;
	}
`
export const SubmitButton = styled.button`
	border-radius: 5px;
	width: 300px;
  height: 4.5rem;
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

  @media screen and (max-width: 500px) and (min-height: 700px) {
    height: 5.2rem;
    font-size: 1.8rem;
	}
`
export const ForgotLinkBox = styled.div`
  color: #000;
  width: 100%;
  display: flex;
  font-size: 1.4rem;

  @media screen and (max-width: 500px) and (min-height: 700px) {
    font-size: 1.6rem;
	}
`
export const JoinLinkBox = styled.div`
	font-size: 1.4rem;
  color: #000;
  width: 100%;
  display: flex;
  justify-content: center;

  @media screen and (max-width: 500px) and (min-height: 700px) {
    font-size: 1.6rem;
	}
`
export const StyledLink = styled(Link)`
  font-size: inherit;
  height: 19px;
  margin-left: 5px;
  text-decoration: underline;
`
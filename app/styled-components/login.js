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
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  @media screen and (max-width: 500px) {
    overflow: hidden;
    height: 100vh; /* Fallback for browsers that do not support Custom Properties */
    height: calc(var(--full-height, 1vh) * 100);;
	}
`
export const FormContainer = styled.div`
  height: 70vh;
 	width: 400px;
  display: flex;
  flex-direction: column;
  gap: 40px;

	@media screen and (max-width: 500px) {
    width: auto;
    max-width: 100vw;
    margin: 0 20px;
    gap: 60px;
	}
  
  @media screen and (max-width: 500px) and (min-height: 700px) {
    height: 100vh; /* Fallback for browsers that do not support Custom Properties */
    height: calc(var(--full-height, 1vh) * 80);
    margin-top: calc(var(--full-height, 1vh) * 15);
    margin-bottom: calc(var(--full-height, 1vh) * 5);
    width: 100vw;
    width: calc(var(--full-width, 1vh) * 94);
    margin-left: calc(var(--full-width, 1vh) * 3);
    margin-right: calc(var(--full-width, 1vh) * 3);
	}
`
export const TitleBox = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  width: 426px;
  
  @media screen and (max-width: 800px) {
    height: auto;
  }

  @media screen and (max-width: 500px) {
    height: auto;
    flex-direction: column;
    align-items: flex-start;
  }

  @media screen and (max-width: 350px) {
    height: auto;
    width: 100vw;
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
    font-size: 4.8rem;
  }

  @media screen and (max-width: 350px) {
    font-size: 3rem;
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
    font-size: 3.2rem;
  }

  @media screen and (max-width: 350px) {
    font-size: 3rem;
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
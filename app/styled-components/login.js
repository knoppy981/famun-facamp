import styled from "styled-components";
import { Form } from '@remix-run/react'

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
export const FormContainer = styled.div`
	width: 100%;
  color: #fff;
  display: flex;
  flex-direction: column;
	grid-gap: 15px;
`
export const RememberMe = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 10px;
  color: #000;
  width: 100%;
  font-size: 1.4rem;
  cursor: pointer;

  @media screen and (max-width: 500px) and (min-height: 700px) {
    font-size: 1.6rem;
	}
`
export const RememberMeCheckBox = styled.input`
  appearance: none;
  background-color: #fff;
  margin: 0;
  width: 2rem;
  height: 2rem;
  border: 1px solid #E6E6E6;
  border-radius: 5px;
  display: grid;
  place-content: center;

  &:checked {
    border-color: #183567;
  }
  &::before {
    content: "";
    width: 2rem;
    height: 2rem;
    transform: scale(0);
    transition: 120ms transform ease-in-out;
    box-shadow: inset 1em 1em #183567;
    transform-origin: center;
    clip-path: polygon(28% 38%, 41% 53%, 75% 24%, 86% 38%, 40% 78%, 15% 50%);
  } 
  &:checked::before {
    transform: scale(1);
  }
`
export const ButtonContainer = styled.div`
  align-self: center;
  width: 300px;
	margin-top: 30px;

  @media screen and (max-width: 500px) and (min-height: 700px) {
    margin-top: 60px;
	}
`
export const LinkBox = styled.div`
  align-self: ${p => p.center ? "center" : "flex-start"};
  color: #000;
  display: flex;
  gap: 5px;
  font-size: 1.4rem;

  @media screen and (max-width: 500px) and (min-height: 700px) {
    font-size: 1.6rem;
	}
`
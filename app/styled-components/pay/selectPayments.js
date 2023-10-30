import { Form, Link } from "@remix-run/react";
import styled from "styled-components";

const azulClaro = '#BDE8F5'
const azul = '#01558A'
const azulCeu = '#14A7D8'
const azulEscuro = '#183567'
const azulBackground = "#EDF9FC"
const verde = '#3FA534'
const vermelho = '#C01627'
const verdeClaro = "#51b85a"
const verdeBackground = "#EBFDEE"
const begeClaro = "#d57748"
const begeBackground = "#FFEFE1"

export const PaymentWrapper = styled.div`
  min-height: 70svh;
  margin: 15vh 0;
 	width: 600px;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 40px;
  
  @media screen and (max-width: 700px) {
    gap: 20px;
    margin: 100px 0 50px;
    width: 100vw;
    padding: 0 15px;
	}
`
export const TitleBox = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  width: 400px;
  
  @media screen and (max-width: 800px) {
    height: auto;
  }

  @media screen and (max-width: 500px) {
    height: auto;
    flex-direction: column;
    align-items: flex-start;
    width: auto;
    margin-left: 0;
    margin-right: auto;

    svg {
      display: none;
    }
  }

  @media screen and (max-width: 350px) {
    height: auto;
    width: 100vw;
  }
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

  @media screen and (max-width: 700px) {
    display: none;
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
export const PageTitle = styled.h3`
  width: 400px;
  font-size: 1.6rem;
  color: #000;

  @media screen and (max-width: 500px) {
    width: 100%;
  }
`
export const Error = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 1.5rem;
  color: #d61f0a;
  svg {
    transform: translateY(-1px);
    width: 14px;
    height: 14px;
  }
`
export const PaymentList = styled.div`
  width: 600px;

  @media screen and (max-width: 600px) {
    width: 100%;
  }
`
export const OverflowText = styled.span`
  font-size: 1.4rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`
export const RightContainer = styled.div`
  margin-left: auto;
  margin-right: 0;
  flex-shrink: 0;
`
export const Price = styled.div`
  width: 400px;
  margin: auto 0 0;
  font-size: 3.6rem;
  font-weight: 900;
  color: ${azulEscuro};

  @media screen and (max-width: 700px) {
    width: 100%;
  }
`
export const ButtonContainer = styled.div`
  gap: 15px;
  min-width: 150px;
`
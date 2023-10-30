import { Link } from "@remix-run/react";
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
export const Container = styled.div`
  width: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;

  @media screen and (max-width: 500px) {
    width: 100%;
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
export const PaymentCountList = styled.ul`
  width: 100%;
  list-style-type: disc;
  padding: 0 25px;
`
export const PaymentsCount = styled.li`
  height: 3rem;
  gap: 15px;
  font-size: 1.6rem;
`
export const StripeElementsWrapper = styled.div`
  display: grid;
  gap: 40px;
  width: 100%;
`
export const ButtonWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  place-items: stretch;
  margin-top: 10px;
  `
export const LinkContainer = styled.div`
  place-self: center;
  font-size: 1.4rem;
`
export const ButtonContainer = styled.div`
  gap: 15px;
  min-width: 150px;
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
export const PayButtonContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  justify-content: center;
  margin-top: 10px;
`
export const GoBackLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
`
export const PayButton = styled.button`
  padding: 0 20px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: ${azulClaro};
  box-shadow: 0px 2px 5px -2px #000000;
  color: #000;
  border-radius: 5px;
	font-size: 1.5rem;
  transition: .4s all ease;
`
import styled from "styled-components";
import { Form, Link } from "@remix-run/react";
import { FiChevronRight } from "react-icons/fi";

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

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`
export const GoBackLinkWrapper = styled.div`
  position: absolute;
  left: 5%;
  top: 5%;
  height: 40px;
  font-size: 1.6rem;
`
export const PaymentWrapper = styled.div`
  min-height: 70svh;
  margin: 15vh 0;
 	width: 600px;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 40px;
  
  @media screen and (max-width: 500px) and (min-height: 700px) {
    gap: 20px;
    margin: 100px 0 50px;
    width: 100vw;
    padding: 0 15px;
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

  @media screen and (max-width: 500px) and (min-height: 700px) {
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
export const ArrowIconBox = styled(FiChevronRight)`
  height: 25px;
  width: 25px;
  color: #000;
  display: flex;
  align-items: bottom;

  @media screen and (max-width: 500px) and (min-height: 700px) {
    display: none;
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
export const Payment = styled.div`
  height: 45px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  gap: 15px;
  border-top: ${p => !p.last && '1px solid #e6e6e6'};
  opacity: ${p => p.disabled ? .6 : 1};
`
export const CheckBox = styled.input`
  flex-shrink: 0;
`
export const OvrflowText = styled.span`
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
export const ColorLabel = styled.div`
  height: 3rem;
  display: flex;
  align-items: center;
  padding: 5px 15px;
  border-radius: 15px;
  gap: 5px;
  color: ${p => p.color === 'red' ? begeClaro : p.color === 'green' ? verdeClaro : azulCeu};
  background: ${p => p.color === 'red' ? begeBackground : p.color === 'green' ? verdeBackground : azulBackground};
  font-size: 1.4rem;

  svg {
    transform: translateY(-1px);
  }
`
export const Price = styled.div`
  width: 400px;
  margin: auto 0 0;
  font-size: 3.6rem;
  font-weight: 900;
  color: ${azulEscuro};

  @media screen and (max-width: 500px) and (min-height: 700px) {
    width: 100%;
  }
`
export const PaymentCountList = styled.ul`
  width: 100%;
  list-style-type: disc;
  padding: 0 25px;
`
export const PaymentsCount = styled.li`
  height: 30px;
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

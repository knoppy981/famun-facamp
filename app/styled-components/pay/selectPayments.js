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

export const PaymentForm = styled(Form)`
 	width: 400px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  
  @media screen and (max-width: 500px) and (min-height: 700px) {
    gap: 20px;
    /* margin: 100px 0 50px;
    width: 100vw;
    width: calc(var(--full-width, 1vh) * 94);
    margin-left: calc(var(--full-width, 1vh) * 3);
    margin-right: calc(var(--full-width, 1vh) * 3); */
	}
`
export const PageTitle = styled.h3`
  font-size: 1.6rem;
  color: #000;
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
export const Label = styled.label`
  font-size: 1.4rem;
	overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`
export const RightContainer = styled.div`
  margin-left: auto;
  margin-right: 0;
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
  font-size: 3.6rem;
  font-weight: 900;
  color: ${azulEscuro};
`
export const ButtonContainer = styled.div`
  margin: auto 0 0;
  display: grid;
  gap: 15px;
`
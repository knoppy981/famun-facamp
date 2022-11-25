import styled from "styled-components";
import { Form } from "@remix-run/react";

const azulClaro = '#BDE8F5'
const azulEscuro = '#183567'

export const FormContainer = styled(Form)`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 50px;
`
export const PaymentDescBox = styled.div`
  
`
export const PaymentDesc = styled.div`

`
export const PaymentPrice = styled.h1`
  color: ${azulEscuro};
  border-radius: 5px;
  padding: 0 10px;
  font-size: 30px;
  font-weight: 500;
  font-weight: 900;
  letter-spacing: 1px;
`
export const PaymentElementContainer = styled.div`
  width: 400px;
`
export const ConfirmPaymentButton = styled.button`
  height: 45px;
  width: 100%;
  background: ${azulClaro};
  border-radius: 5px;
	font-size: 15px;
  transition: .4s all ease;
  box-shadow: 0px 2px 5px -2px #000000;

  &:disabled {
    transform: translateY(4px);
    color: #666666;
  }
`
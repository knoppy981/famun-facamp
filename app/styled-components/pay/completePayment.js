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

export const Wrapper = styled.div`
  display: grid;
  gap: 15px;
  padding: 5px;
`
export const Title = styled.h3`
  font-size: 1.8rem;
  color: #000;
  width: 426px;
`
export const PaymentList = styled.ul`
  list-style-type: disc;
  padding: 0 15px;
`
export const PaymentsCount = styled.li`
  height: 30px;
  gap: 15px;
  font-size: 1.4rem;
`
export const Price = styled.div`
  font-size: 3.6rem;
  font-weight: 900;
  margin-left: 10px;
  color: ${azulEscuro};
  min-width: 426px;
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
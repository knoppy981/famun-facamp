import styled from 'styled-components'
import { Form, Link } from '@remix-run/react'

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
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  gap: 30px;
`
export const Title = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: #000;
`
export const Container = styled.div`
  width: 100%;
`
export const SubTitle = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: #000;
  padding-left: 10px;
  margin-bottom: 10px;
`
export const PaymentsList = styled.ul`
  width: 100%;
  max-height: ${ p => p.transactionList ? '160px' : '100px'};
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 5px;
  border: 1px solid #E6E6E6;
  border-radius: 5px;
`
export const PaymentContainer = styled.li`
  /* border-bottom: 1px solid #E6E6E6;
  ${p => p.first && "border-top: 1px solid #E6E6E6"}; */
  height: 45px;
  padding: 5px 0;
`
export const Payment = styled.div`
  width: 100%;
  height: 100%;
  border-left: 3px solid ${p => p.status ? verdeClaro : azulCeu};
  padding: 0 10px;
  display: grid;
  align-items: center;
  grid-template-columns: ${p => p.pending ? '14fr 3.5fr .1fr 5.4fr' : '14fr 3.5fr 2.5fr 2fr'};
  grid-gap: 25px;
  font-size: 1.5rem;
`
export const PaymentMethod = styled.div`
  place-self: center;
`
export const PaymentInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: inherit;
`
export const PaymentAmountContainer = styled.div`
  display: flex;
`
export const PaymentAmount = styled.div`
  height: 30px;
  display: flex;
  align-items: center;
  padding: 5px 15px;
  border-radius: 15px;
  background: ${p => p.pending ? begeBackground : verdeBackground};
  color: ${p => p.pending ? begeClaro : verde};
  font-size: 1.4rem;
`
export const PaymentLinkContainer = styled.div`
  display: flex;
`
export const PaymentLink = styled.a`
  height: 30px;
  display: flex;
  align-items: center;
  padding: 5px 15px;
  border-radius: 15px;
  gap: 5px;
  color: ${azulCeu};
  background: ${azulBackground};
  font-size: 1.4rem;

  svg {
    transform: translateY(-1px);
  }
`
export const PayContainer = styled.div`

`
export const PayButton = styled(Link)`
  border: none;
  outline: none;
  height: 30px;
  display: flex;
  align-items: center;
  padding: 5px 15px;
  border-radius: 15px;
  gap: 5px;
  color: ${azulCeu};
  background: ${azulBackground};
  font-size: 1.4rem;

  svg {
    transform: translateY(-1px);
  }
`
export const PaymentDate = styled.div`
  place-self: center end;
  font-size: inherit;
`


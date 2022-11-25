import styled from 'styled-components'

const azulClaro = '#BDE8F5'
const azul = '#01558A'
const azulCeu = '#14A7D8'
const azulEscuro = '#183567'
const verde = '#3FA534'
const vermelho = '#C01627'

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
  font-weight: 500;
  color: #000;
  padding-left: 10px;
  margin-bottom: 10px;
`
export const PaymentsList = styled.ul`
  border-top: 1px solid #E6E6E6;
  width: 100%;
`
export const PaymentContainer = styled.li`
  border-bottom: 1px solid #E6E6E6;
  height: 45px;
  padding: 5px 0 ;
`
export const Payment = styled.div`
  width: 100%;
  height: 100%;
  border-left: 3px solid red;
`

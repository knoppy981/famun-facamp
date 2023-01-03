import styled from "styled-components"

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
  margin-top: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
`
export const Container = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  gap: 15px;

  &::before {
    position: absolute;
    content: '';
    height: 80%;
    width: 1px;
    top: 50%;
    left: 0;
    transform: translate(-25px, -50%);
    background: #e6e6e6;
  }
`
export const PaymentList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 10px 15px 10px;
  border-bottom: 1px solid #000;
  gap: 10px;
  max-width: 600px;
  max-height: 210px;
  overflow-y: auto;
  overflow-x: hidden;

  &:active::-webkit-scrollbar-thumb {
    visibility: visible;
    background: rgb(120, 120, 120);
    opacity: 1;
  }
  &:focus::-webkit-scrollbar-thumb {
    visibility: visible;
    background: rgb(120, 120, 120);
    opacity: 1;
  }
  &:hover::-webkit-scrollbar-thumb {
    visibility: visible;
    background: rgb(120, 120, 120);
    opacity: 1;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgb(200, 200, 200);
    transition: all .4s ease;
    border-radius: 2px;
    visibility: visible;
  }
  &::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
`
export const PaymentListTitle = styled.div`
  font-size: 1.4rem;
  margin-bottom: 10px;
`
export const Payment = styled.div`
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`
export const PaymentName = styled.div`
  font-size: 1.3rem;
`
export const PaymentPrice = styled.div`
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
export const CheckoutLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 10px;
`
export const PayButton = styled.button`
  height: 40px;
  width: 150px;
  background: ${azulClaro};
  box-shadow: 0px 2px 5px -2px #000000;
  color: #000;
  border-radius: 5px;
	font-size: 1.5rem;
  transition: .4s all ease;
`
export const TotalPrice = styled.div`
  font-size: 3.6rem;
  font-weight: 900;
  color: ${azulEscuro};
`
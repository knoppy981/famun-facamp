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

export const Title = styled.h3`
  font-size: 2.2rem;
  font-weight: 500;
  color: #000;
  padding-left: 5px;
`
export const Wrapper = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: 4fr 1fr;
`
export const Container = styled.div`
  max-width: 600px;
  margin-top: 20px;
  padding: 0 5px;
  max-height: 250px;
  overflow-y: auto;
  overflow-x: hidden;
  transition: all .3s ease;

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
export const Line = styled.div`
  width: 100%;
  height: 1px;
`
export const Box = styled.div`
  height: 45px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  gap: 15px;
  border-top: ${p => !p.last && '1px solid #e6e6e6'};
  opacity: ${p => p.disabled ? .6 : 1};
`
export const CheckBox = styled.input`

`
export const Label = styled.label`
  font-size: 1.4rem;
`
export const ItemContainer = styled.div`
  margin-left: auto;
  margin-right: 0;
`
export const Item = styled.div`
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
export const PriceContainer = styled.div`
  place-self: end;
`
export const PriceList = styled.div`
  margin-right: 0;
  margin-left: auto;
  display: flex;
  flex-direction: column-reverse;
`
export const PriceItem = styled.div`
  margin-right: 0;
  margin-left: auto;
  font-size: 1.6rem;
  padding: 0 10px;
  border-bottom: ${p => p.first && "1px solid #a7a7a7"};
`
export const Price = styled.h2`
  font-size: 3.6rem;
  font-weight: 900;
  color: ${azulEscuro};
`
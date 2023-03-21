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
  min-width: 426px;
  display: grid;
  gap: 20px;
`
export const Title = styled.h3`
  font-size: 1.8rem;
  color: #000;
  width: 426px;
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
export const Price = styled.div`
  font-size: 3.6rem;
  font-weight: 900;
  margin-left: 10px;
  color: ${azulEscuro};
  min-width: 426px;
`
export const Container = styled.div`
  max-width: 600px;
  padding: 5px;
  max-height: ${p => `calc(70vh - 259px -${p.height})`};
  overflow-y: scroll;
  overflow-x: hidden;

  background: /* Shadow covers */
  linear-gradient(white 30%, rgba(255, 255, 255, 0)), linear-gradient(rgba(255, 255, 255, 0), white 70%) 0 100%, /* Shadows */
  radial-gradient(farthest-side at 50% 0, rgba(0, 0, 0, .2), rgba(0, 0, 0, 0)), radial-gradient(farthest-side at 50% 100%, rgba(0, 0, 0, .2), rgba(0, 0, 0, 0)) 0 100%;
  background-repeat: no-repeat;
  background-color: white;
  background-size: 100% 40px, 100% 40px, 100% 14px, 100% 14px;
  /* Opera doesn't support this in the shorthand */
  background-attachment: local, local, scroll, scroll;
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
  place-self: start;
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
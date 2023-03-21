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
  font-size: 1.8rem;
  color: #000;
  width: 426px;
`
export const Wrapper = styled.div`
  min-width: 426px;
  display: grid;
  gap: 15px;
  padding: 5px;
  max-height: calc(70vh - 165px);
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
export const Price = styled.div`
  font-size: 3.6rem;
  font-weight: 900;
  margin-left: 10px;
  color: ${azulEscuro};
  min-width: 426px;
`
export const PayButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
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
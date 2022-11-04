import styled from "styled-components"
import { Form } from "@remix-run/react"

const azulClaro = '#BDE8F5'
const azul = '#01558A'
const azulCeu = '#14A7D8'
const azulEscuro = '#183567'
const verde = '#3FA534'
const vermelho = '#C01627'

export const FormContainer = styled(Form)`
  width: 100%;
  height: 100%;
  display: grid;
  gap: 20px;
  position: relative;
`
export const ShadowBackground = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  background: rgba(0,0,0,.5);
  box-shadow: 0px 0px 15px 5px rgba(0,0,0,.5);
  z-index: 1;
`
export const Title = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: #000;
`
export const Grid = styled.div`
  display: grid;
  grid-template-columns: ${p => p.columns};
  gap: 20px;
  padding: 0 10px;
  margin-bottom: 20px;
`
export const SubmitButton = styled.button`
  place-self: center;
  grid-column-start: 1;
  grid-column-end: 3;
  margin-top: 20px;
  height: 45px;
  width: 200px;
  background: ${azulClaro};
  border-radius: 5px;
	font-size: 15px;
  transition: .4s all ease;
  box-shadow: 0px 2px 5px -2px #000000;

  &:disabled {
    color: #666666;
  }
`
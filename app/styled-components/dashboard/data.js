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
  height: 105%;
  width: 105%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: ${p => p.show ? "flex" : "none"};
  align-items: center;
  justify-content: center;
  z-index: 1;
  border-radius: 5px;
`
export const ClickableBackground = styled.div`
  height: 100%;
  width: 100%;
  backdrop-filter: blur(8.5px);
  -webkit-backdrop-filter: blur(8.5px);
`
export const BackgroundContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 80%;
  width: 50%;
  background: #fff;
  border-radius: 5px;
  z-index: 2;
  padding: 20px;
  box-shadow: 0px 0px 15px 5px rgba(0,0,0,.5);
  display: flex;
  flex-direction: column;
`
export const BackgroundCloseButton = styled.div`
  cursor: pointer;
  width: 20px;
  margin-bottom: 20px;

  svg {
    height: 20px;
    width: 20px;
  }
`
export const BackgroundDataContainer = styled.div`
  max-height: 180px;
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
export const BackgroundTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #000;
  margin-bottom: 5px;
  padding: 0 10px;
`
export const BackgroundData = styled.div`
  width: 100%;
  height: 45px;
  padding: 0 10px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  border-radius: 5px;
  border: 1px solid #E6E6E6;
  font-size: 16px;
  font-weight: 500;
`
export const BackgroundButton = styled.div`
  margin-top: auto;
  margin-bottom: 0;
  height: 45px;
  width: 100%;
  background: ${azulClaro};
  border-radius: 5px;
	font-size: 16px;
  transition: .4s all ease;
  box-shadow: 0px 2px 5px -2px #000000;
  cursor: pointer;
  display: grid;
  place-content: center;
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
    transform: translateY(4px);
    color: #666666;
  }
`
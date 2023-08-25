import styled from "styled-components";

const color1 = "#192638"
const azulClaro = '#BDE8F5'
const azul = '#01558A'
const azulBackground = "#EDF9FC"
const azulCeu = '#14A7D8'
const azulEscuro = '#183567'
const verdeClaro = "#51b85a"
const verdeBackground = "#EBFDEE"
const begeClaro = "#d57748"
const begeBackground = "#FFEFE1"

export const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`
export const CheckboxGroupLabel = styled.span`
  font-size: 1.4rem;
  color: ${props => props.err ? '#d61f0a' : '#000'};
`
export const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.4rem;
  cursor: pointer;
  color: #000;
`
export const Input = styled.input`
  margin-top: 3px;
  outline: none;
  appearance: none;
  background-color: #fff;
  margin: 0;
  width: 1.8rem;
  height: 1.8rem;
  border: 1px solid #E6E6E6;
  border-radius: 5px;
  display: grid;
  place-content: center;
  box-shadow: 0px 1px 3px -1px #000000;
  cursor: pointer;

  &:checked {
    border-color: ${azulClaro};
    background: ${azulClaro};
  }
  &::before {
    content: "";
    width: 1.8rem;
    height: 1.8rem;
    transform: scale(0);
    transition: 120ms transform ease-in-out;
    box-shadow: inset 1em 1em #000;
    transform-origin: center;
    clip-path: polygon(25% 40%, 41% 59%, 77.03% 26.91%, 86% 38%, 40% 78%, 15% 50%);
  } 
  &:checked::before {
    transform: scale(.9);
  }
`
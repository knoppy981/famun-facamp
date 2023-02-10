import { Form } from "@remix-run/react"
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

export const DataForm = styled(Form)`

`
export const Title = styled.div`
  height: 3rem;
  font-size: 1.8rem;
  font-weight: 500;
  color: #000;
  display: flex;
  align-items: center;
  gap: 10px;
`
export const DataWrapper = styled.div`
  width: 100%;
  height: 350px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  border-radius: 15px;
  transition: all .4s ease;
`
export const DataTitle = styled.div`
  display: flex;
  height: 3rem;
  align-items: center;
  margin-bottom: 20px;
  font-size: 1.8rem;
  font-weight: 500;
  color: #000;
  gap: 15px;
`
export const ColorItem = styled.button`
  height: 3rem;
  display: flex;
  align-items: center;
  padding: 5px 15px;
  border-radius: 15px;
  gap: 5px;
  color: ${p => p.color === 'red' ? begeClaro : p.color === 'green' ? verdeClaro : p.color === 'gray' ? '#A7A7A7' : azulCeu};
  background: ${p => p.color === 'red' ? begeBackground : p.color === 'green' ? verdeBackground : p.color === 'gray' ? '#e1e1e1' : azulBackground};
  font-size: 1.4rem;
  transition: all .4s ease;

  svg {
    transform: translateY(-1px);
  }
`
export const DataContainer = styled.div`
  width: 400px;
  display: grid;
  margin-bottom: 10px;
  grid-gap: 8px;
  padding: 15px;
  border-radius: 5px;
  border: 1px solid #E6E6E6;

`
export const ColumnDataContainer = styled.div`
  width: 400px;
  padding: 15px;
  border-radius: 5px;
  border: 1px solid #E6E6E6;
  margin-bottom: 15px;

  div {
    margin-bottom: 6px;
  }
`
export const ItemContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  grid-gap: 8px;
`
export const Key = styled.div`
  font-size: 1.4rem;
  color: ${p => p.err ? '#d61f0a' : '#666666'};
  display: flex;
  align-items: center;
`
export const Item = styled.input`
  font-size: 1.4rem;
  height: 3rem;
  padding: 0 5px;
  border-radius: 5px;
  border: 1px solid ${p => p.err ? '#d61f0a' : '#E6E6E6'};
  outline: none;

  -webkit-text-fill-color: #000 !important;
  &:focus, &:hover {
    border: 1px solid ${p => p.err ? '#d61f0a' : azulCeu};
  }

  &:disabled {
    border: 1px solid transparent;
    background: transparent;
  }
`
export const Select = styled.select`
  height: 3rem;
  outline: none;
  border: none;
  font-size: 1.4rem;
  padding: 0 30px 0 5px;
  border-radius: 5px;
  border: 1px solid ${p => p.err ? '#d61f0a' : '#E6E6E6'};
  flex-grow: 2;
  font-size: 1.4rem;
  color: #000;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: url(http://cdn1.iconfinder.com/data/icons/cc_mono_icon_set/blacks/16x16/br_down.png) no-repeat right transparent;
  background-position-x: 95%;
  background-size: 10px;

  &:focus, &:hover {
    border: 1px solid ${p => p.err ? '#d61f0a' : azulCeu};
  }

  &:disabled {
    border: 1px solid transparent;
    background: transparent;
    opacity: 1;
  }
`
export const Option = styled.option`

`
export const CheckboxButton = styled.button`
  height: 2.5rem;
  display: flex;
  align-items: center;
  border: none;
  outline: none;
  ${p => !p.disabled && 
    'cursor: pointer; &:hover {color: red;}'
  };
`
export const CheckboxContainer = styled.div`
  height: 2.5rem;
  display: flex;
  align-items: center;
  ${p => !p.disabled && 'cursor: pointer'};
`
export const CheckboxLabel = styled.div`
  padding: 0 5px;
  font-size: 1.4rem;
  transition: .2s all ease-in-out;
`
export const CheckboxIcon = styled.div`
  display: grid;
  place-content: center;
  transition: .2s all ease-in-out;
  ${p => p.disabled && 'display: none; cursor: pointer'};
  
  svg {
    height: 1.5rem;
    width: 1.5rem;
  }
`
export const CheckboxInput = styled.input`
  font-size: 1.4rem;
  height: 3rem;
  padding: 0 5px;
  border-radius: 5px;
  transition: .2s all ease-in-out;
  border: 1px solid ${p => p.err ? '#d61f0a' : '#E6E6E6'};
  outline: none;

  -webkit-text-fill-color: #000 !important;
  &:focus, &:hover {
    border: 1px solid ${p => p.err ? '#d61f0a' : azulCeu};
  }

  &:disabled {
    border: 1px solid transparent;
    background: transparent;
  }
`
export const SMContainer = styled.div`
  height: 3rem;
  display: flex;
  align-items: center;
`
export const SMButton = styled.button`
  display: grid;
  place-content: center;
  transition: .2s all ease-in-out;
  ${p => p.disabled ? 'display: none; cursor: pointer;' : '&:hover {color: red;}'};
  
  svg {
    height: 1.5rem;
    width: 1.5rem;
  }
`
export const SMLabel = styled.label`
  width: 100px;
  padding: 0 5px;
  font-size: 1.4rem;
  color: #666666;
  transition: .2s all ease-in-out;
`
export const SMInput = styled.input`
  font-size: 1.4rem;
  height: 3rem;
  padding: 0 5px;
  border-radius: 5px;
  border: 1px solid ${p => p.err ? '#d61f0a' : '#E6E6E6'};
  outline: none;
  -webkit-text-fill-color: #000 !important;

  &:focus, &:hover {
    border: 1px solid ${p => p.err ? '#d61f0a' : azulCeu};
  }
  &:disabled {
    border: 1px solid transparent;
    background: transparent;
  }
  &::placeholder {
    opacity: .6;
    font-style: italic;
  }
`

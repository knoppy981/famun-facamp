import { Form } from "@remix-run/react"
import styled from "styled-components"
import InputMask from "react-input-mask"
import { useState } from "react"
import PhoneInput from "react-phone-number-input"


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
  @media screen and (max-width: 700px) {
    padding: 0 15px;
  }
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
  font-weight: 400;

  svg {
    transform: translateY(-1px);
  }

  @media screen and (max-width: 700px) {
    height: 4rem;
    font-size: 1.6rem;
    border-radius: 20px;
    gap: 7px;
    opacity: 1;
    font-weight: 500;
  }
`
export const Wrapper = styled.div`
  width: 100%;
  grid-gap: 8px;
  display: flex;
  flex-wrap: wrap;
  ${({ isWrapped }) => isWrapped && `
    & > div {
      flex-basis: 100%;
    }
  `}
`
export const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px;
  border-radius: 5px;
  border: 1px solid #E6E6E6;
  overflow-x: hidden;
`
export const ContainerTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 10px;
  border-bottom: 2px solid ${p => p.border === 'red' ? begeClaro : p.border === 'green' ? verdeClaro : p.border === 'gray' ? '#A7A7A7' : azulCeu};

  @media screen and (max-width: 700px) {
    font-size: 1.8rem;
  }
`
export const InputContainer = styled.div`
  display: grid;
  grid-template-columns: fit-content(50%) minmax(0, 1fr);
  gap: 8px;

  @media screen and (max-width: 700px) {
    gap: 4px;
  }
`
export const Label = styled.label`
  font-size: 1.4rem;
  color: ${p => p.err ? '#d61f0a' : '#666666'};
  white-space: nowrap;
  place-self: center end;
  display: flex;
  align-items: center;

  @media screen and (max-width: 700px) {
    /* height: auto;
    justify-self: start;
    padding: 0 5px; */
    font-size: 1.6rem;
  }
`
export const GridInput = styled.div`
  display: flex;
`
export const Input = styled(InputMask)`
  width: 100%;
  min-width: 250px;
  font-size: 1.4rem;
  height: 3rem;
  padding: 0 5px;
  border-radius: 5px;
  color: #000;
  border: 1px solid ${p => p.err ? '#d61f0a' : '#E6E6E6'};
  outline: none;
  background: transparent;

  -webkit-text-fill-color: #000 !important;
  &:focus, &:hover {
    border: 1px solid ${p => p.err ? '#d61f0a' : azulCeu};
  }

  &:disabled {
    border: 1px solid transparent;
  }

  @media screen and (max-width: 700px) {
    min-width: 0;
    height: 4rem;
    font-size: 1.6rem;
    opacity: 1;
  }
`
export const DateInput = (props) => {
  let mask = 'dD/mM/YYYY';
  let formatChars = {
    'Y': '[0-9]',
    'd': '[0-3]',
    'D': '[0-9]',
    'm': '[0-1]',
    'M': '[1-9]'
  };

  let beforeMaskedValueChange = (newState, oldState, userInput) => {
    let { value } = newState;

    let dateParts = value.split('/');
    let dayPart = dateParts[0];
    let monthPart = dateParts[1];

    // Conditional mask for the 2nd digit of day based on the first digit
    if (dayPart?.startsWith('3'))
      formatChars['D'] = '[0-1]'; // To block 39, 32, etc.
    else if (dayPart?.startsWith('0'))
      formatChars['D'] = '[1-9]'; // To block 00.
    else
      formatChars['D'] = '[0-9]'; // To allow 05, 15, 25  etc.


    // Conditional mask for the 2nd digit of month based on the first digit
    if (monthPart?.startsWith('1'))
      formatChars['M'] = '[0-2]'; // To block 15, 16, etc.
    else
      formatChars['M'] = '[1-9]'; // To allow 05, 06  etc - but blocking 00.

    return { value, selection: newState.selection };
  }

  return (
    <Input
      {...props}
      mask={mask}
      maskChar={null}
      formatChars={formatChars}
      beforeMaskedValueChange={beforeMaskedValueChange}
    />
  )
}
let AuxDiv = styled.div`
  font-size: 1.4rem;
  height: 3rem;
  padding: 0 5px;
  border-radius: 5px;
  border: 1px solid ${p => p.disabled ? 'transparent' : p => p.err ? '#d61f0a' : '#E6E6E6'};
  outline: none;
  background: transparent;

  -webkit-text-fill-color: #000 !important;
  &:focus, &:hover {
    border: 1px solid ${p => p.disabled ? 'transparent' : p => p.err ? '#d61f0a' : azulCeu};
  }

  @media screen and (max-width: 700px) {
    min-width: 0;
    height: 4rem;
    font-size: 1.6rem;
    opacity: 1;
  }
`
export const PhoneNumberInput = (props) => {
  return (
    <AuxDiv disabled={props.disabled}>
      <PhoneInput {...props} />
    </AuxDiv>
  )
}
export const Select = styled.select`
  height: 3rem;
  outline: none;
  border: none;
  font-size: 1.4rem;
  padding: 0 5px 0 5px;
  border-radius: 5px;
  border: 1px solid ${p => p.err ? '#d61f0a' : '#E6E6E6'};
  flex-grow: 2;
  font-size: 1.4rem;
  color: #000;
  appearance: none;
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

  @media screen and (max-width: 700px) {
    min-width: 0;
    height: 4rem;
    font-size: 1.6rem;
    opacity: 1;
  }
`
export const Option = styled.option`

`
export const CheckboxButton = styled.div`
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
  background: transparent;

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
export const DragDropContainer = styled.div`
  display: flex;
  gap: 10px;
`
export const DragDropIndexes = styled.div`
  display: grid;

  div {
    display: grid;
    align-self: center;
    font-size: 1.4rem;
  }
`
export const ListItemContainer = styled.div`
 
  height: 35px;
  display: flex;
  align-items: center;
`
export const ListItem = styled.div`
  display: flex;
  align-items: center;
  height: 80%;
  background: #fff;
  border-radius: 5px;
  padding: 0 5px;
  background: ${p => p.first ? azulClaro : "#fff"};
  border: 1px solid ${p => p.first ? 'transparent' : '#E6E6E6'};
  transition: .3s all ease;
  font-size: 1.4rem;
`
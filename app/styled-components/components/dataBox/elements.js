import styled from "styled-components"
import { motion } from "framer-motion"

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
  width: 100%;
  grid-gap: 8px;
  display: flex;
  flex-wrap: wrap;
  pointer-events: auto;
  opacity: 1;
  
  ${({ isWrapped }) => isWrapped && `
    & > div {
      flex-basis: 100%;
    }
  `}

  ${({ isDisabled }) => isDisabled && `
    pointer-events: none;
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
  gap: 10px;
  padding: 15px;
  border-radius: 5px;
  border: 1px solid #E6E6E6;
  overflow-x: hidden;

  /* @media screen and (max-width: 700px) {
    border: none;
  } */
`
export const ContainerTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 500;
  border-bottom: 1px solid ${p => p.border === 'red' ? begeClaro : p.border === 'green' ? verdeClaro : p.border === 'gray' ? '#A7A7A7' : azulCeu};

  @media screen and (max-width: 700px) {
    border: none;
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
export const CheckboxLabel = styled.div`
  padding: 0 5px;
  font-size: 1.4rem;
  transition: .2s all ease-in-out;

  @media screen and (max-width: 700px) {
    font-size: 1.6rem;
  }
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
export const ReorderableListWrapper = styled.div`
  display: flex;
  gap: 10px;
`
export const ReorderableListContainer = styled.div`
  
`
export const ReordableListIndexes = styled.div`
  display: grid;

  div {
    display: grid;
    align-self: center;
    font-size: 1.4rem;
  }
`
export const LanguageSelectContainer = styled.div`
  display: grid;
  box-sizing: border-box;
  min-width: 0;

  & > div {
    height: 3rem;
    font-size: 1.4rem;
    border-radius: 5px;
    padding: 0 5px;
    @media screen and (max-width: 700px) {
      height: 4rem;
      font-size: 1.6rem;
    }
  }
`
export const Error = styled.div`
  font-size: 1.4rem;
  color: #d61f0a;
` 
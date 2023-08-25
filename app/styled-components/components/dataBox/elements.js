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
export const ListItemContainer = styled.div`
  height: 4.5rem;
  display: flex;
  align-items: center;

  @media screen and (max-width: 700px) {
    height: 5.2rem;
  }
`
export const ListItem = styled.div`
  display: flex;
  align-items: center;
  height: 80%;
  background: #fff;
  border-radius: 5px;
  padding: 0 5px;
  background: ${p => p.first ? azulClaro : "#fff"};
  box-shadow: 0px 2px 5px -2px #000000;
  border: 1px solid ${p => p.first ? 'transparent' : '#E6E6E6'};
  transition: .3s all ease;
  font-size: 1.4rem;

  @media screen and (max-width: 700px) {
    font-size: 1.6rem;
  }
`
export const StickyButton = styled(motion.div)`
  position: sticky;
  bottom: 80px;
  margin: 0 0 0 auto;
  width: max-content;

  @media screen and (max-width: 700px) {
    bottom: 20px;
  }
`
export const Error = styled.div`
  font-size: 1.4rem;
  color: #d61f0a;
` 
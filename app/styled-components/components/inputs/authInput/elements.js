import styled from "styled-components"

import InputMask from "react-input-mask"

const azulClaro = '#BDE8F5'
const azul = '#01558A'
const azulCeu = '#14A7D8'
const azulEscuro = '#183567'
const azulBackground = "#EDF9FC"

export const InputWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  grid-gap: 5px;
`
export const Label = styled.label`
  font-size: 1.4rem;
  margin-left: 5px;
  color: ${props => props.err ? '#d61f0a' : '#000'};

  @media screen and (max-width: 300px) {
    font-size: 10px;
  }
`
export const InputContainer = styled.div`
  position: relative;
`
export const Input = styled(InputMask)`
  width: 100%;
  height: 45px;
  border-radius: 5px;
  border: 1px solid ${p => p.err ? '#d61f0a' : '#E6E6E6'};
  outline: none;
  padding: 0 10px;
  font-size: 1.6rem;
  transition: all .4 ease;
  color: #000;
  background: transparent;

  -webkit-text-fill-color: #000 !important;
  &:focus, &:hover {
    border: 1px solid ${p => p.err ? '#d61f0a' : azulCeu};
  }
`
export const Select = styled.select`
  outline: none;
  border: none;
  flex-grow: 2;
  font-size: 1.6rem;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: url(http://cdn1.iconfinder.com/data/icons/cc_mono_icon_set/blacks/16x16/br_down.png) no-repeat right transparent;
  background-position-x: 95%;
  background-size: 10px;
`
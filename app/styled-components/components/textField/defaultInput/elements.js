import styled from "styled-components"

import InputMask from "react-input-mask"
import PhoneInput from "react-phone-number-input"

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

  @media screen and (max-width: 500px) and (min-height: 700px) {
    font-size: 1.6rem;
	}
`
export const InputContainer = styled.div`
  position: relative;
`
export const Input = styled(InputMask)`
  width: 100%;
  height: 4.5rem;
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

  @media screen and (max-width: 500px) and (min-height: 700px) {
    height: 5.2rem;
    font-size: 1.8rem;
	}
`
let AuxDiv = styled.div`
  width: 100%;
  height: 4.5rem;
  border-radius: 5px;
  border: 1px solid ${p => p.disabled ? 'transparent' : p => p.err ? '#d61f0a' : '#E6E6E6'};
  outline: none;
  padding: 0 10px;
  font-size: 1.6rem;
  transition: all .4 ease;
  color: #000;
  background: transparent;

  &:focus, &:hover {
    border: 1px solid ${p => p.disabled ? 'transparent' : p => p.err ? '#d61f0a' : azulCeu};
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
height: 4.5rem;
outline: none;
border: none;
font-size: 1.6rem;
padding: 0 30px 0 15px;
border-radius: 5px;
border: 1px solid ${p => p.err ? '#d61f0a' : '#E6E6E6'};
flex-grow: 2;
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

@media screen and (max-width: 500px) and (min-height: 700px) {
  height: 5.2rem;
  font-size: 1.8rem;
}
`
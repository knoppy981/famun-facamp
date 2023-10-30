import styled from "styled-components"

import InputMask from "react-input-mask"
import PhoneInput from "react-phone-number-input/input"

const azulCeu = '#14A7D8'

export const Label = styled.label`
  margin-left: 5px;
  color: ${props => props.err ? '#d61f0a' : '#000'};
`
export const Container = styled.div`
  position: relative;
  border: 1px solid ${p => p.disabled ? "transparent" : '#E6E6E6'};
  display: inline-block;
  transition: all 0.2s ease-in-out;
  --c: ${p => p.err ? '#d61f0a' : azulCeu};
  --o: ${p => p.err ? 1 : 0};

  input:focus ~ div, input:active ~ div {
    --o: 1;
  }
`
export const InputBorder = styled.div`
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  opacity: var(--o, 0);
  border-radius: 5px;
  box-shadow: 0 0 5px 1px var(--c, "tranparent");
  transition: all 0.2s ease-in-out;
`
export const Input = styled(InputMask)`
  width: 100%;
  height: 100%;
  outline: none;
  border: none;
  color: #000;
  background: transparent;
  letter-spacing: ${p => p.letterSpacing ?? "normal"};
  -webkit-text-fill-color: #000 !important;
`
export const PhoneNumberInput = styled(PhoneInput)`
  width: 100%;
  height: 100%;
  outline: none;
  border: none;
  color: #000;
  background: transparent;
  -webkit-text-fill-color: #000 !important;
`
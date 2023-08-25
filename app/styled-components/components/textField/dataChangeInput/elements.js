import styled from "styled-components"
import React, {useSate, useRef, useEffect} from 'react'

import InputMask from "react-input-mask"
import PhoneInput from "react-phone-number-input"

const azulClaro = '#BDE8F5'
const azul = '#01558A'
const azulCeu = '#14A7D8'
const azulEscuro = '#183567'
const azulBackground = "#EDF9FC"

export const Label = styled.label`
  font-size: 1.4rem;
  color: ${p => p.err ? '#d61f0a' : '#666666'};
  white-space: nowrap;
  place-self: center end;
  display: flex;
  align-items: center;

  @media screen and (max-width: 700px) {
    font-size: 1.6rem;
    place-self: center start;
  }
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

  &::placeholder {
    font-style: italic;
    opacity: 0.6;
  }

  @media screen and (max-width: 700px) {
    min-width: 0;
    height: 4rem;
    font-size: 1.6rem;
    opacity: 1;
  }
`
export const PhoneInputContainer = styled.div`
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
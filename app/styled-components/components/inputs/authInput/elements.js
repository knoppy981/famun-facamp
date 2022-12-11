import styled from "styled-components"

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
  font-size: 14px;
  margin-left: 5px;
  color: ${props => props.err ? '#d61f0a' : '#000'};

  @media screen and (max-width: 300px) {
    font-size: 10px;
  }
`
export const InputContainer = styled.div`
  position: relative;
`
export const Input = styled.input`
  width: 100%;
  height: 45px;
  border-radius: 5px;
  border: 1px solid ${p => p.err ? '#d61f0a' : '#E6E6E6'};
  outline: none;
  padding: 0 10px;
  font-size: 16px;
  transition: all .4 ease;
  color: #000;

  -webkit-text-fill-color: #000 !important;
  &:focus, &:hover {
    border: 1px solid ${p => p.err ? '#d61f0a' : azulCeu};
  }
`
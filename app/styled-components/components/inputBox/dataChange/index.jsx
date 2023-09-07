import React from 'react'
import styled from "styled-components"

const azulCeu = '#14A7D8'

export const InputWrapper = styled.div`
  display: grid;
  grid-template-columns: fit-content(50%) minmax(0, 1fr);
  gap: 8px;
  box-sizing: border-box;
  min-width: 0;

  @media screen and (max-width: 700px) {
    gap: 4px;
  }

  & > label {
    font-size: 1.4rem;
    white-space: nowrap;
    place-self: center end;

    @media screen and (max-width: 700px) {
      place-self: center start;
      font-size: 1.6rem;
    }
  }
  & > input {
    width: 100%;
    min-width: 250px;
    font-size: 1.4rem;
    height: 3rem;
    padding: 0 5px;
    border-radius: 5px;
    -webkit-text-fill-color: #000 !important;

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
  }
  & > div {
    height: 3rem;
    font-size: 1.4rem;
    border-radius: 5px;
    padding: 0 5px;
    @media screen and (max-width: 500px) and (min-height: 700px) {
      height: 4rem;
      font-size: 1.6rem;
	  }
  }
`

const DataChangeInputBox = ({ children, ...props }) => {
  return (
    <InputWrapper>
      {children}
    </InputWrapper>
  )
}

export default DataChangeInputBox
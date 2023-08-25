import React from 'react'
import styled from "styled-components"

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  grid-gap: 5px;
  box-sizing: border-box;
  min-width: 0;

  & > label {
    font-size: 1.4rem;
    @media screen and (max-width: 500px) and (min-height: 700px) {
      font-size: 1.6rem;
	  }
  }
  & > input {
    height: 4.5rem;
    font-size: 1.6rem;
    padding: 0 10px;
    border-radius: 5px;
    @media screen and (max-width: 500px) and (min-height: 700px) {
      height: 5.2rem;
      font-size: 1.8rem;
	  }

    &::placeholder {
      font-style: italic;
      opacity: 0.6;
    }
  }
  & > div {
    height: 4.5rem;
    font-size: 1.6rem;
    padding: 0 10px;
    @media screen and (max-width: 500px) and (min-height: 700px) {
      height: 5.2rem;
      font-size: 1.8rem;
	  }
  }
`

const DefaultInputBox = ({ children, ...props }) => {
  return (
    <InputWrapper>
      {children}
    </InputWrapper>
  )
}

export default DefaultInputBox
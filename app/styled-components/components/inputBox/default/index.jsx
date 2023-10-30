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
    align-self: flex-start;
    @media screen and (max-width: 700px) {
      font-size: 1.6rem;
	  }
  }
  & > div {
    height: 4.5rem;
    font-size: 1.6rem;
    border-radius: 5px;
    padding: 0 10px;
    @media screen and (max-width: 700px) {
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
import React from 'react'
import styled from "styled-components"

const azul = '#14A7D8'
const azulClaro = "#EDF9FC"
const verde = "#51b85a"
const verdeClaro = "#EBFDEE"
const bege = "#d57748"
const begeClaro = "#FFEFE1"

export const ButtonWrapper = styled.div`
  height: 3rem;
  display: flex;
  align-items: center;
  padding: 5px 15px;
  border-radius: 15px;
  gap: 5px;
  color: ${p => p.color === 'red' ? bege : p.color === 'green' ? verde : p.color === 'gray' ? '#A7A7A7' : azul};
  background: ${p => p.color === 'red' ? begeClaro : p.color === 'green' ? verdeClaro : p.color === 'gray' ? '#e1e1e1' : azulClaro};
  font-size: 1.4rem;
  transition: all .4s ease;
  font-weight: 400;
  box-shadow: ${p => p.boxShadow ? `0px 0px 15px 10px ${p.color === 'red' ? begeClaro : p.color === 'green' ? verdeClaro : p.color === 'gray' ? '#e1e1e1' : azulClaro}` : 'none'};

  svg {
    transform: translateY(-1px);
  }

  @media screen and (max-width: 700px) {
    height: 4rem;
    font-size: 1.6rem;
    border-radius: 2rem;
    gap: 7px;
    opacity: 1;
    font-weight: 500;
  }
`

const ColorButtonBox = ({ children, ...props }) => {
  return (
    <ButtonWrapper {...props}>
      {children}
    </ButtonWrapper >
  )
}

export default ColorButtonBox
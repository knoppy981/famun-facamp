import React from 'react'
import styled, { ThemeProvider } from "styled-components"

const azul = '#14A7D8'
const azulClaro = "#EDF9FC"
const verde = "#51b85a"
const verdeClaro = "#EBFDEE"
const bege = "#d57748"
const begeClaro = "#FFEFE1"

const lightTheme = {
  fontBlue: '#14A7D8',
  backgroundBlue: '#EDF9FC',
  fontGreen: '#51b85a',
  backgroundGreen: '#EBFDEE',
  fontRed: '#d57748',
  backgroundRed: '#FFEFE1'
};

const darkTheme = {
  fontBlue: '#EDF9FC',
  backgroundBlue: '#14A7D8',
  fontGreen: '#EBFDEE',
  backgroundGreen: '#51b85a',
  fontRed: '#FFEFE1',
  backgroundRed: '#d57748'
};

export const ButtonWrapper = styled.div`
  height: 3rem;
  display: flex;
  align-items: center;
  padding: 5px 15px;
  border-radius: 15px;
  gap: 5px;
  color: ${p => p.color === 'red' ?
    p.theme.fontRed : p.color === 'green' ?
      p.theme.fontGreen : p.color === 'gray' ?
        '#A7A7A7' : p.theme.fontBlue
  };
  background: ${p => p.color === 'red' ?
    p.theme.backgroundRed : p.color === 'green' ?
      p.theme.backgroundGreen : p.color === 'gray' ?
        '#e1e1e1' : p.theme.backgroundBlue
  };
  font-size: 1.4rem;
  transition: all .4s ease;
  font-weight: 400;
  box-shadow: ${p => p.boxShadow ? `0px 0px 15px 10px 
  ${p.color === 'red' ?
      p.theme.backgroundRed : p.color === 'green' ?
        p.theme.backgroundGreen : p.color === 'gray' ?
          '#e1e1e1' : p.theme.backgroundBlue}` :
    'none'};

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
    <ThemeProvider theme={props.theme === "dark" ? darkTheme : lightTheme}>
      <ButtonWrapper {...props}>
        {children}
      </ButtonWrapper >
    </ThemeProvider>
  )
}

export default ColorButtonBox
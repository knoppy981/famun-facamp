import React from 'react'
import styled, { ThemeProvider } from "styled-components"

const getColorStyles = (color, theme) => {
  switch (color) {
    case 'red':
      return { font: theme.fontRed, background: theme.backgroundRed };
    case 'green':
      return { font: theme.fontGreen, background: theme.backgroundGreen };
    case 'gray':
      return { font: '#A7A7A7', background: '#e1e1e1' };
    default:
      return { font: theme.fontBlue, background: theme.backgroundBlue };
  }
}

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
  border-radius: 1.5rem;
  gap: 5px;
  color: ${p => getColorStyles(p.color, p.theme).font};
  background: ${p => getColorStyles(p.color, p.theme).background};
  font-size: 1.4rem;
  transition: all .4s ease;
  font-weight: 400;
  box-shadow: ${p => p.boxShadow ? `0px 0px 15px 10px ${getColorStyles(p.color, p.theme).background}}` : 'none'};

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

const ColorButtonBox = ({ children, theme, ...props }) => {

  return (
    <ThemeProvider theme={theme === "dark" ? darkTheme : lightTheme}>
      <ButtonWrapper {...props}>
        {children}
      </ButtonWrapper >
    </ThemeProvider>
  )
}

export default ColorButtonBox
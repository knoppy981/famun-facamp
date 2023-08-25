import styled from "styled-components";

const color1 = "#192638"
const azulClaro = '#BDE8F5'
const azul = '#01558A'
const azulBackground = "#EDF9FC"
const azulCeu = '#14A7D8'
const azulEscuro = '#183567'
const verdeClaro = "#51b85a"
const verdeBackground = "#EBFDEE"
const begeClaro = "#d57748"
const begeBackground = "#FFEFE1"

export const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 5px;
`
export const Indicator = styled.li`
  width: 100%;
  margin-left: 0;
  height: 2px;
  margin-bottom: -2px;
  outline: none;
  background: transparent;

  ${p => p.isDropTarget ? `background: ${azulCeu}` : ""};

  &:last-child {
    margin-bottom: 0;
    margin-top: -2px;
  }
`
export const StyledOption = styled.li`
  display: flex;
  align-items: center;
  height: 4rem;
  padding: 0 5px;
  outline: ${azulClaro};
  background: #fff;
  border-radius: 5px;
  transition: .3s all ease;
  font-size: 1.4rem;
  cursor: grab;

  ${({ isDisabled }) => !isDisabled && `
    box-shadow: 0px 2px 5px -2px #000000;
  `}

  &[aria-selected=true] {
    background: ${azulBackground};
    border-color: ${azulCeu};
  }

  @media screen and (max-width: 500px) and (min-height: 700px) {
    font-size: 1.6rem;
    height: 4.8rem
	}
`
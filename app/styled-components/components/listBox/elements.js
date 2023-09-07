import styled from "styled-components";

const color1 = "#192638"
const azulClaro = '#BDE8F5'
const azul = '#01558A'
const azulCeu = '#14A7D8'
const azulEscuro = '#183567'
const azulBackground = "#EDF9FC"
const verdeClaro = "#51b85a"
const verdeBackground = "#EBFDEE"
const begeClaro = "#d57748"
const begeBackground = "#FFEFE1"

export const List = styled.ul`
  max-height: 300px;
  overflow: auto;
  list-style: none;
  padding: 10px 0;
  background: transparent;
  outline: none;
  width: 100%;
`;
export const ListItem = styled.li`
  padding: 5px 20px;
  background: ${(props) => (props.isFocused ? '#fff' : "")};
  color: ${(props) => props.isFocused ? "#000" : "#fff"};
  font-size: 1.4rem;
  font-weight: ${(props) => (props.isSelected ? "600" : "normal")};
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  outline: none;

  @media screen and (max-width: 700px) {
    font-size: 1.8rem;
  }
`;

export const ItemContent = styled.div`
  display: flex;
  align-items: center;
`;
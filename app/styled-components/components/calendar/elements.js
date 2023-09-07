import styled from "styled-components";

const azulCeu = '#14A7D8'
const azulEscuro = '#183567'
const azulBackground = "#EDF9FC"

export const Calendar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 210px;

  @media screen and (max-width: 700px) {
    width: 100%;
    gap: 15px;
  }
`
export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1.5rem;
  gap: 15px;

  @media screen and (max-width: 700px) {
    font-size: 2.5rem;

    svg {
      font-size: 3rem;
    }
  }
`
export const HeaderItem = styled.th`
  font-size: 1.5rem;
`
export const Item = styled.div`
  display: ${p => p.hidden ? "none" : "grid"};
  place-content: center;
  font-size: 1.4rem;
  outline: none;
  border: none;
  border-radius: 5px;
  transition: all .3s ease;

  ${p => p.disabled || p.unavailable ? "opacity: .6; cursor: auto" : ""};
  ${p => p.selected ? `background: ${azulCeu}; color: ${azulBackground}` : ""}

  @media screen and (max-width: 700px) {
    font-size: 1.8rem;
  }
`
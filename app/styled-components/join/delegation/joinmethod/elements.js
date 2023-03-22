import styled from "styled-components";

const azulClaro = '#BDE8F5'

export const Title = styled.h3`
  width: 426px;
  font-size: 2.2rem;
  font-weight: 500;
  color: #000;
`
export const Subtitle = styled.p`
  width: 426px;
  font-size: 1.4rem;
  color: #000;
`
export const ButtonsContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 25px;
`
export const Button = styled.button`
  height: 45px;
  width: 205px;
  background: ${azulClaro};
  border-radius: 5px;
	font-size: 1.5rem;
  transition: .4s all ease;
  box-shadow: 0px 2px 5px -2px #000000;

  &:disabled {
    color: #666666;
  }
  &:hover {
    transform: translateY(-2px);
  }
`
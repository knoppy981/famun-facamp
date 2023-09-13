import styled from "styled-components";

export const Wrapper = styled.div`
  position: absolute;
  right: 5%;
  top: 5%;

  & > button {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 1.6rem;
    color: #000;
  }
`
export const Title = styled.div`
  font-size: 1.5rem;
  font-weight: 400;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 10px;
  word-wrap: break-word;

  @media screen and (max-width: 700px) {
    font-size: 2rem;
    font-weight: 500;
  }
`
export const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.5rem;
  font-weight: 400;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  transition: all ease .5s;

  ${({ isSelected }) => isSelected && `
    --_p: #fff;
    transform: translateX(10px);
  `}

  &:hover {
    --_p: #fff; 
    transform: translateX(10px);
  }

  &::before {
    position: absolute;
    content: '';
    top: 50%;
    left: -15px;
    transform: translateY(-50%);
    height: 4px;
    width: 4px;
    border-radius: 2px;
    transition: all ease .4s;
    background: var(--_p, transparent);
  }

  @media screen and (max-width: 700px) {
    font-size: 1.8rem;
  }
`

export const NacionalityFlag = styled.div`
  height: 2.5rem;
  width: 2.5rem;
  background-size: contain;
  background-position: 50%;
  background-repeat: no-repeat;

  @media screen and (max-width: 700px) {
    height: 3.2rem;
    width: 3.2rem;
  }
`
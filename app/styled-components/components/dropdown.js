import styled from "styled-components"
import { Form } from "@remix-run/react"

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


export const Container = styled.div`
  display: ${p => p.open ? 'block' : 'none'};
  position: absolute;
  z-index: 99;
  top: 110%;
  right: -20px;
  width: 30rem;
  background: ${color1};
  box-shadow: 0px 3px 5px -2px #000000;
  border-radius: 10px;
`
export const Reference = styled.div`
  display: ${p => p.open ? 'block' : 'none'};
  position: absolute;
  height: 10px;
  width: 10px;
  right: 50%;
  top: calc(110% - 5px);
  z-index: 98;
  background: ${color1};
  border-radius: 2px;
  box-shadow: -1px 1px 5px -2px #000000;
  transform: translateX(50%) rotate(45deg);
`
export const Menu = styled.ul`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
`
export const Title = styled.li`
  margin-top: 10px;
  height: 30px;
  display: flex;
  align-items: center;
  gap: 10px;  
  padding: 0 10px;
  font-size: 1.5rem;
  font-weight: 400;
  color: #fff;
`
export const Link = styled.input`
  height: 40px;
  border-radius: 5px;
  border: 1px solid #E6E6E6;
  outline: none;
  padding: 0 10px;
  margin: 0 10px;
  font-size: 1.5rem;
  background: transparent;
  color: #fff;
`
export const Data = styled.div`
  width: 100%;
  height: 40px;
  margin: 0 20px;
  font-size: 1.8rem;
  font-weight: 500;
  color: #fff;
  letter-spacing: 1px;
`
export const Item = styled.li`
  position: relative;
  height: 40px;
  padding: 0 10px;
  background: transparent;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.5rem;
  font-weight: 400;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  transition: all .4s;

  &:hover {
    --_p: #fff;
    transform: translateX(10px);
  }

  &::before {
    position: absolute;
    content: '';
    top: 50%;
    left: -5px;
    transform: translateY(-50%);
    height: 4px;
    width: 4px;
    border-radius: 2px;
    transition: background .4s;
    background: var(--_p, transparent);
  }
`
export const DForm = styled(Form)`
  width: 100%;
`
export const Button = styled.button`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
`
export const ColorItem = styled.button`
  height: 3rem;
  display: flex;
  align-items: center;
  padding: 5px 15px;
  border-radius: 15px;
  gap: 5px;
  color: ${p => p.color === 'red' ? begeBackground : p.color === 'green' ? verdeBackground : azulBackground};
  background: ${p => p.color === 'red' ? begeClaro : p.color === 'green' ? verdeClaro : azulCeu};
  font-size: 1.4rem;

  svg {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: .6;
  }
`
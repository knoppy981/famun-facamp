import styled from "styled-components";
import { Link, Form } from '@remix-run/react'
import { BsCheckAll } from 'react-icons/bs'

const azulClaro = '#BDE8F5'
const azul = '#01558A'
const azulCeu = '#14A7D8'
const azulEscuro = '#183567'
const azulBackground = "#EDF9FC"
const verde = '#3FA534'
const vermelho = '#C01627'
const verdeClaro = "#51b85a"
const verdeBackground = "#EBFDEE"
const begeClaro = "#d57748"
const begeBackground = "#FFEFE1"

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 30px;
`
export const Title = styled.div`
  height: 3rem;
  font-size: 1.8rem;
  font-weight: 500;
  color: #000;
  display: flex;
  align-items: center;
  gap: 10px;
`
export const Item = styled.div`
  height: 3rem;
  display: flex;
  align-items: center;
  padding: 5px 15px;
  border-radius: 15px;
  gap: 5px;
  color: ${p => p.color === 'red' ? begeClaro : p.color === 'green' ? verdeClaro : azulCeu};
  background: ${p => p.color === 'red' ? begeBackground : p.color === 'green' ? verdeBackground : azulBackground};
  font-size: 1.4rem;
  font-weight: 400;

  svg {
    transform: translateY(-1px);
  }
`
export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`
export const Grid = styled.div`
  display: flex;
  gap: 30px;
`
export const GridItem = styled.div`
  position: relative;
  min-width: 200px;
  padding: 20px;

  &::before {
    content: '';
    position: absolute;
    height: 50%;
    top: 50%;
    left: -15px;
    transform: translateY(-50%);
    border-left: ${p => !p.first ? '1px solid #E6E6E6' : undefined};
  }
`
export const GridItemTitle = styled.div`
  font-size: 1.6rem;
  font-weight: 500;
  color: #000;
  display: flex;
  align-items: center;
  gap: 10px;
`
export const GridList = styled.div`
  margin-top: 10px;
`
export const GridListItem = styled.div`
  font-size: 1.5rem;
  margin-bottom: 10px;
  display: flex;
`
export const StepsContainer = styled.div`
  display: grid;
  grid-gap: 15px;
  grid-template-columns: 1fr 1fr 1fr;
`
export const Step = styled.div`
  position: relative;
  height: 45px;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  color: #fff;
  background: ${p => p.completed ? azulClaro : "transparent"};
  box-shadow: ${p => p.completed ? "0px 2px 5px -2px #000000" : "none"};
  color: #000;
  border: 1px solid ${p => p.completed ? 'transparent' : '#E6E6E6'};
  border-radius: 5px;
  font-weight: 400;
  font-size: 1.5rem;
  cursor: pointer;
`
export const StepCompleteIcon = styled(BsCheckAll)`
  position: absolute;
  bottom: 20px;
  right: 30px;
  height: 30px;
  width: 30px;
`
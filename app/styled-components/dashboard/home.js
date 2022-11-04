import styled from "styled-components";
import { Link, Form } from '@remix-run/react'
import { BsCheckAll } from 'react-icons/bs'

const azulClaro = '#BDE8F5'
const azul = '#01558A'
const azulCeu = '#14A7D8'
const azulEscuro = '#183567'
const verde = '#3FA534'
const vermelho = '#C01627'

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 25px;
`
export const SubTitle = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: #000;
`
export const Container = styled.div`
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
  font-weight: 500;
  font-size: 15px;
  cursor: pointer;
`
export const StepCompleteIcon = styled(BsCheckAll)`
  position: absolute;
  bottom: 20px;
  right: 30px;
  height: 30px;
  width: 30px;
`
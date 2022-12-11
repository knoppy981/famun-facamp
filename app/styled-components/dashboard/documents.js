import styled from 'styled-components'
import { Form, Link } from '@remix-run/react'

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
  position: relative;
  gap: 30px;
`
export const Title = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: #000;
`
export const Container = styled.div`
  width: 100%;
`
export const SubTitle = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: #000;
  padding-left: 10px;
  margin-bottom: 10px;
`
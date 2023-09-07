import styled from 'styled-components'

import { motion } from 'framer-motion'
import { Form } from '@remix-run/react'

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

export const DataForm = styled(Form)`
  @media screen and (max-width: 700px) {
    padding: 0 15px;
  }
`
export const DataTitleBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 15px;
  gap: 15px;
  padding-left: 5px;

  @media screen and (max-width: 700px) {
    gap: 5px;
  }
`
export const DataTitle = styled.div`
  font-size: 1.6rem;
  font-weight: 500;

  @media screen and (max-width: 700px) {
    font-size: 1.8rem;
  }
`
export const InputWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  box-sizing: border-box;
  min-width: 0;

  & > label {
    font-size: 1.4rem;
    white-space: nowrap;
    place-self: center start;

    @media screen and (max-width: 700px) {
      font-size: 1.6rem;
    }
  }
  & > div {
    height: 3rem;
    font-size: 1.4rem;
    border-radius: 5px;
    padding: 0 5px;
    @media screen and (max-width: 500px) and (min-height: 700px) {
      height: 4rem;
      font-size: 1.6rem;
	  }
  }
`
export const DelegateCountdown = styled.div`
  @media screen and (max-width: 700px) {
    margin-top: 10px
  }
`
export const StickyButton = styled(motion.div)`
  position: sticky;
  bottom: 80px;
  margin: 0 0 0 auto;
  width: max-content;

  @media screen and (max-width: 700px) {
    bottom: 20px;
  }
`
export const DialogTitle = styled.h2`
  font-size: 2rem;
  font-weight: 500;
  margin-bottom: 15px;
`
export const DialogItem = styled.div`
  font-size: 1.6rem;
  margin-bottom: 15px;
`
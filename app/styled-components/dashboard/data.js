import { Form } from "@remix-run/react"
import styled from "styled-components"
import { motion } from "framer-motion"

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
  @media screen and (max-width: 700px) {
    padding: 0 15px;
  }
`
export const DataTitle = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  font-size: 1.8rem;
  font-weight: 500;
  color: #000;
  gap: 15px;

  @media screen and (max-width: 700px) {
    flex-direction: column;
    align-items: start;
  }
`
export const ColorItem = styled.button`
  height: 3rem;
  display: flex;
  align-items: center;
  padding: 5px 15px;
  border-radius: 15px;
  gap: 5px;
  color: ${p => p.color === 'red' ? begeClaro : p.color === 'green' ? verdeClaro : p.color === 'gray' ? '#A7A7A7' : azulCeu};
  background: ${p => p.color === 'red' ? begeBackground : p.color === 'green' ? verdeBackground : p.color === 'gray' ? '#e1e1e1' : azulBackground};
  font-size: 1.4rem;
  transition: all .4s ease;
  font-weight: 400;
  box-shadow: ${p => p.boxShadow ? `0px 0px 15px 10px ${p.color === 'red' ? begeBackground : p.color === 'green' ? verdeBackground : p.color === 'gray' ? '#e1e1e1' : azulBackground}` : 'none'};

  svg {
    transform: translateY(-1px);
  }

  @media screen and (max-width: 700px) {
    height: 4rem;
    font-size: 1.6rem;
    border-radius: 2rem;
    gap: 7px;
    opacity: 1;
    font-weight: 500;
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
export const Error =styled.div`
  font-size: 1.4rem;
  color: #d61f0a;
` 
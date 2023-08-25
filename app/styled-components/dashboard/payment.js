import styled from 'styled-components'
import { Form, Link } from '@remix-run/react'
import { motion } from 'framer-motion'

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
  gap: 15px;
`
export const Title = styled.div`
  height: 3rem;
  font-size: 1.8rem;
  font-weight: 500;
  color: #000;
  display: flex;
  align-items: center;
  gap: 10px;

  @media screen and (max-width: 700px) {
    padding: 0 15px;
  }
`
export const Menu = styled.div`
  display: flex;
  gap: 25px;
  z-index: 99;
  background: #fff;

  @media screen and (max-width: 700px) {
    position: sticky;
    padding: 10px 15px;
    overflow-x: scroll;
    overflow-y: hidden;
    top: 45px;
    border-radius: 0;

    box-shadow: ${p => p.isSticky ? "1px 0 1px 1px #E6E6E6" : "none"};
  }

`
export const MenuItem = styled.div`
  height: 3rem;
  position: relative;
  display: flex;
  align-items: center;
  font-size: 1.4rem;
  padding: 0 15px;
  transition: opacity .4s ease;
  cursor: pointer;
  white-space: nowrap;

  ${p => p.colorItem && "padding: 0;"}

  @media screen and (max-width: 700px) {
    border-radius: 25px;
    border: 1px solid #e6e6e6;
  }
`
export const UnderLine = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: -1;
  height: 100%;
  background: #e1e1e1;
  border-radius: 25px;
`
export const SubTitle = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: #000;
  padding-left: 10px;
  margin-bottom: 10px;
`
export const OverflowContainer = styled.div`
  display: flex;
  width: 100%;
  overflow-x: scroll;

  @media screen and (max-width: 700px) {
    padding: 0 15px;
  }
`
export const PaymentsTable = styled.table`
  border-radius: 5px;
  flex: 1 0 auto;
  border-collapse: separate;
  border-spacing: 0;
  overflow: hidden;
  border: 1px solid #E6E6E6;
`
export const TableRow = styled.tr`
  height: 4.5rem;
  background: ${p => p.example ? '#FAFAFA' : 'transparent'};

  td {
    font-weight: ${p => p.example ? 500 : 400};
  }
`
export const TableCell = styled.td`
  padding: 0 15px;
  font-size: 1.5rem;
  border-bottom: 1px solid rgba(0,0,0,.2);

  ${({ user }) => user && `
    border-left: 2px solid ${azulCeu};
  `}
`
export const CellFlexBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: inherit;
`
export const ColorItem = styled.div`
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

  svg {
    transform: translateY(-1px);
  }
`
export const PaymentLink = styled.a`
  height: 30px;
  display: flex;
  align-items: center;
  padding: 5px 15px;
  border-radius: 15px;
  gap: 5px;
  color: ${azulCeu};
  background: ${azulBackground};
  font-size: 1.4rem;

  svg {
    transform: translateY(-1px);
  }
`
export const PayButton = styled(Link)`
  border: none;
  outline: none;
  height: 30px;
  display: flex;
  align-items: center;
  padding: 5px 15px;
  border-radius: 15px;
  gap: 5px;
  color: ${azulCeu};
  background: ${azulBackground};
  font-size: 1.4rem;

  svg {
    transform: translateY(-1px);
  }
`
export const NoPaymentsMessage = styled.div`
  padding: 5px 0;
  font-size: 1.4rem;

  @media screen and (max-width: 700px) {
    font-size: 1.5rem;
    padding: 5px 30px;
  }
`

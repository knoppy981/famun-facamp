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

export const OverflowContainer = styled.div`
  display: flex;
  width: 100%;
  overflow-x: scroll;

  @media screen and (max-width: 700px) {
    padding: 0 15px;
  }
`
export const DelegatesTable = styled.table`
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
  cursor: ${p => p.example ? 'auto' : 'pointer'};

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
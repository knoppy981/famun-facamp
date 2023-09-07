import styled from "styled-components"

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
  cursor: ${p => p.example ? 'default' : 'pointer'};

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
export const NoPaymentsMessage = styled.div`
  padding: 5px 0;
  font-size: 1.4rem;

  @media screen and (max-width: 700px) {
    font-size: 1.5rem;
    padding: 5px 30px;
  }
`

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

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
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
export const Columns = styled.div`
  width: 100%;
  display: flex;
  gap: 40px;
`
export const DataWrapper = styled.div`
  width: 400px;
`
export const DataTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 1.6rem;
  font-weight: 500;
  margin-bottom: 20px;
  padding-left: 15px;
  color: #000;
`
export const ColorItem = styled.div`
  height: 3rem;
  display: flex;
  align-items: center;
  padding: 5px 15px;
  border-radius: 15px;
  gap: 5px;
  color: ${p => p.color === 'red' ? begeClaro : p.color === 'green' ? verdeClaro : azulCeu};
  background: ${p => p.color === 'red' ? begeBackground : p.color === 'green' ? verdeBackground : azulBackground};
  font-size: 1.4rem;

  svg {
    transform: translateY(-1px);
  }
`
export const DataContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 8px;
  margin-bottom: 8px;
  padding: 0 15px;
  border-radius: 15px;
`
export const ColumnDataContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 10px;
`
export const Key = styled.div`
  font-size: 1.4rem;
  color: #666666;
`
export const Item = styled.input`
  font-size: 1.4rem;
  height: 3rem;
  padding: 0 5px;
  border: 1px solid #e6e6e6;
  border-radius: 5px;
`

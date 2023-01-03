import styled from 'styled-components'

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
  gap: 25px;
`
export const Nav = styled.div`
  height: 50px;
  display: flex;
  justify-content: space-between;
  padding: 0 5px;
`
export const TitleBox = styled.div`
  height: 100%;
`
export const SubTitle = styled.div`
  font-size: 1.4rem;
  font-weight: 400;
  color: #666666;
`
export const Title = styled.div`
  font-size: 1.8rem;
  font-weight: 500;
  color: #000;
`
export const NavMenu = styled.div`
  align-self: flex-end;
  padding-right: 20px;
`
export const NavItem = styled.div`
  position: relative;
  height: 40px;
  display: grid;
`
export const NavIcon = styled.div`
  place-self: center;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;

  p {
    font-size: 1.8rem;
    font-weight: 400;
    transform: translateY(1px);
  }
`
export const Menu = styled.div`
  margin-left: 5px;
  display: flex;
  gap: 25px;
`
export const MenuItem = styled.div`
  height: 3rem;
  position: relative;
  display: flex;
  align-items: center;
  font-size: 1.4rem;
  opacity: ${p => p.active ? 1 : 0.6};
  padding: 0 15px;
  transition: opacity .4s ease;
  cursor: pointer;
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
export const DelegatesListWrapper = styled.div`
  width: 100%;
  border: 1px solid #E6E6E6;
  border-radius: 5px;
`
export const DelegatesList = styled.ul`
  width: 100%;
  height: 220px;
  overflow-y: auto;
  overflow-x: hidden;
`
export const DelegateContainer = styled.div`
  height: 4.5rem;
  padding: 5px;
  border-bottom: 1px solid rgba(0,0,0,.2);
  background: ${p => p.example ? '#FAFAFA' : 'transparent'};
`
export const Delegate = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  align-items: center;
  padding: 0 20px;
  grid-template-columns: 4fr 1fr 1fr;
  border-left: ${p => p.user ? `3px solid ${azulCeu}` : "3px solid transparent"};
  font-size: 1.5rem;
`
export const Icon = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;

  svg {
    height: 25px;
    width: 25px;
  }
`
export const Name = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: inherit;
`
export const Role = styled.div`
  display: flex;
  padding-left: ${p => p.example ? '15px' : '0'};
  font-size: inherit;
`
export const JoinDate = styled.div`
  place-self: center end;
  font-size: inherit;
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

  svg {
    transform: translateY(-1px);
  }
`
export const DataPageWrapper = styled.div`
`
export const DataLine = styled.div`
  display: flex;
  gap: 40px;
  margin-bottom: 20px;
`
export const DataContainer = styled.ul`
  position: relative;
  max-width: 400px;

  &::before {
    position: absolute;
    content: '';
    height: 60%;
    width: 1px;
    top: 50%;
    left: 0;
    transform: translate(-20px, -50%);
    background: ${p => !p.first && '#e6e6e6'};
  }
`
export const DataTitle = styled.li`
  font-size: 1.4rem;
  color: #666666;
`
export const Data = styled.li`
  font-size: 1.6rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`
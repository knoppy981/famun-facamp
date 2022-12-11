import styled from 'styled-components'

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
export const DelegationContainer = styled.div`
  display: grid;
  width: 100%;
  grid-gap: 25px;
  margin-top: 25px;
`
export const DelegationDataWrapper = styled.div`
`
export const DelegatesListWrapper = styled.div`
  width: 100%;
  border: 1px solid #E6E6E6;
  border-radius: 5px;
`
export const DelegatesList = styled.ul`
  width: 100%;
  height: 250px;
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
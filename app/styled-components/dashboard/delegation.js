import styled from 'styled-components'

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
`
export const SubTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #666666;
  padding-left: 5px;
`
export const Title = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: #000;
  padding-left: 5px;
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
export const Delegate = styled.div`
  height: 45px;
  display: grid;
  align-items: center;
  padding: 0 0 0 20px;
  grid-template-columns: 4fr 1fr 1fr 1fr;
  font-size: 15px;
  background: ${p => p.user ? azulClaro : p.example ? '#FAFAFA' : 'transparent'};
  border-bottom: 1px solid rgba(0,0,0,.2);
`
export const DelegateIcon = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;

  svg {
    height: 25px;
    width: 25px;
  }
`
export const DelegateName = styled.div`

`
export const DelegateEmail = styled.div`

`
export const DelegateJoinDate = styled.div`

`
export const DelegateSubscription = styled.div`

`
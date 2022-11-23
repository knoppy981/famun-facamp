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
  position: relative;
`
export const ShadowBackground = styled.div`
  position: absolute;
  height: 105%;
  width: 105%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: ${p => p.show ? "flex" : "none"};
  align-items: center;
  justify-content: center;
  z-index: 1;
  border-radius: 5px;
`
export const ClickableBackground = styled.div`
  height: 100%;
  width: 100%;
  backdrop-filter: blur(8.5px);
  -webkit-backdrop-filter: blur(8.5px);
`
export const BackgroundContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 80%;
  width: 50%;
  background: #fff;
  border-radius: 5px;
  z-index: 2;
  padding: 20px;
  box-shadow: 0px 0px 15px 5px rgba(0,0,0,.5);
`
export const BackgroundCloseButton = styled.div`
  cursor: pointer;
  width: 20px;
  margin-bottom: 20px;

  svg {
    height: 20px;
    width: 20px;
  }
`
export const BackgroundTitle = styled.div`
  margin-top: 30px;
  font-size: 14px;
  font-weight: 500;
  color: #666666;
`
export const BackgroundData = styled.div`
  color: ${azulEscuro};
  border-radius: 5px;
  padding: 0 10px;
  font-size: 30px;
  font-weight: 500;
  font-weight: 900;
  letter-spacing: 1px;
`
export const LinkBox = styled.input`
  margin: 10px 0;
  width: 100%;
  height: 45px;
  border-radius: 5px;
  border: 1px solid #E6E6E6;
  outline: none;
  padding: 0 10px;
  font-size: 16px;
  transition: all .4 ease;
  color: #000;
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
  font-size: 14px;
  font-weight: 500;
  color: #666666;
`
export const Title = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: #000;
`
export const NavMenu = styled.div`
  align-self: flex-end;
`
export const NavItem = styled.button`
  font-size: 18px;
  font-weight: 500;
  outline: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;

  p {
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
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

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
`
export const NavContainer = styled.div`
  transition: all ease .3s;
`
export const Nav = styled.div`
  display: ${p => p.active ? 'flex' : 'none'};
  justify-content: space-between;
  margin-bottom: 25px;
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
  height: 3rem;
  font-size: 1.8rem;
  font-weight: 500;
  color: #000;
  display: flex;
  align-items: center;
  gap: 10px;
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
  display: flex;
  margin-left: 5px;
  margin-bottom: 25px;
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
  margin-right: 25px;
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
  cursor: ${p => p.example ? 'auto' : 'pointer'};
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
export const DataForm = styled(Form)`
`
export const DataWrapper = styled.div`
  max-height: 350px;
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  transition: all .4s ease;

  overflow-y: scroll;
  overflow-x: hidden;

  background: /* Shadow covers */
  linear-gradient(white 30%, rgba(255, 255, 255, 0)), linear-gradient(rgba(255, 255, 255, 0), white 70%) 0 100%, /* Shadows */
  radial-gradient(farthest-side at 50% 0, rgba(0, 0, 0, .2), rgba(0, 0, 0, 0)), radial-gradient(farthest-side at 50% 100%, rgba(0, 0, 0, .2), rgba(0, 0, 0, 0)) 0 100%;
  background-repeat: no-repeat;
  background-color: white;
  background-size: 100% 40px, 100% 40px, 100% 14px, 100% 14px;
  /* Opera doesn't support this in the shorthand */
  background-attachment: local, local, scroll, scroll;
`
export const DataContainer = styled.div`
  max-width: 550px;
  min-width: 400px;
  display: grid;
  margin-bottom: 10px;
  grid-gap: 8px;
  padding: 15px;
  border-radius: 5px;
  border: 1px solid #E6E6E6;
`
export const UserDataContainer = styled.div`
  width: 100%;
  min-height: 300px;
  display: flex;
  grid-gap: 8px;

  @media screen and (max-width: 1090px) {
    flex-direction: column;
	}

  @media screen and (max-height: 580px) {
    flex-direction: column;
	}
`
export const UserSelectBox = styled.div`
  display: flex;
  align-items: center;
  padding: 5px 15px;
  margin-bottom: 10px;
  gap: 15px;
`
export const UserSelectTitle = styled.div`
  font-size: 1.5rem;
`
export const UserSelect = styled.select`
  height: 3rem;
  outline: none;
  border: none;
  font-size: 1.4rem;
  padding: 0 30px 0 5px;
  border-radius: 5px;
  border: 1px solid ${p => p.err ? '#d61f0a' : '#E6E6E6'};
  font-size: 1.4rem;
  color: #000;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: url(http://cdn1.iconfinder.com/data/icons/cc_mono_icon_set/blacks/16x16/br_down.png) no-repeat right transparent;
  background-position-x: 95%;
  background-size: 10px;

  &:focus, &:hover {
    border: 1px solid ${p => p.err ? '#d61f0a' : azulCeu};
  }

  &:disabled {
    border: 1px solid transparent;
    background: transparent;
    opacity: 1;
  }
`
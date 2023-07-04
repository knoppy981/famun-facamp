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
  position: relative;
`
export const Nav = styled(motion.div)`
  width: 100%;
	display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 15px;

  @media screen and (max-width: 700px) {
    padding: 0 15px;
  }
`
export const NavContainer = styled.div`
  font-size: 1.8rem;
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
export const DelegationTitle = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  font-size: 1.8rem;
  flex: 1 0;
  min-width: 0;
`
export const SubTitle = styled.div`
  font-size: 1.4rem;
  font-weight: 400;
  color: #666666;
`
export const Title = styled.h2`
  gap: 10px;
  font-size: 1.8rem;
  font-weight: 500;
  color: #000;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
export const NavButton = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.8rem;
  color: #000;
  white-space: nowrap;
`
export const NavButtonTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.8rem;
  font-weight: 500;
  cursor: pointer;

  svg {
    transform: translateY(-1px);
  }
`
export const Menu = styled.div`
  display: flex;
  position: relative;
  margin-left: 5px;
  margin-bottom: 25px;
  z-index: 99;
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 0 10px 20px #fff;

  @media screen and (max-width: 700px) {
    position: sticky;
    top: 40px;
    margin: 0 0 15px 0;
    padding: 10px 0 10px 15px;
    overflow-x: scroll;
    overflow-y: hidden;
    top: 45px;
    box-shadow: none;
    border-radius: 0;

    box-shadow: ${p => p.isSticky ? "1px 0 1px 1px #E6E6E6" : "none"};
  }

  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
  &::-webkit-scrollbar {
    display: none;
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
  margin-right: 25px;
  white-space: nowrap;

  ${p => p.colorItem && "padding: 0;"}

  @media screen and (max-width: 700px) {
    margin-right: 10px;
    border-radius: 25px;
    border: 1px solid #e6e6e6;
    ${p => p.colorItem && "border: none;"}
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
export const Container = styled(motion.div)`
  margin-bottom: 50px;

  @media screen and (max-width: 700px) {
    margin: 0;
  }
`
export const OverflowContainer = styled.div`
  display: flex;
  width: 100%;
  overflow-x: scroll;

  @media screen and (max-width: 700px) {
    padding: 0 15px;
  }
`
export const DelegatesListWrapper = styled.div`
  border: 1px solid #E6E6E6;
  border-radius: 5px;
  flex: 1 0 auto;
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
  @media screen and (max-width: 700px) {
    padding: 0 15px;
  }
`
export const DataWrapper = styled.div`
  //max-height: 350px;
  width: 100%;
  display: flex;
  gap: 10px;
  flex-direction: column;
  flex-wrap: nowrap;
  transition: all .4s ease;

/*   overflow-y: scroll;
  overflow-x: hidden;

  background:
  linear-gradient(white 30%, rgba(255, 255, 255, 0)), linear-gradient(rgba(255, 255, 255, 0), white 70%) 0 100%,
  radial-gradient(farthest-side at 50% 0, rgba(0, 0, 0, .2), rgba(0, 0, 0, 0)), radial-gradient(farthest-side at 50% 100%, rgba(0, 0, 0, .2), rgba(0, 0, 0, 0)) 0 100%;
  background-repeat: no-repeat;
  background-color: white;
  background-size: 100% 40px, 100% 40px, 100% 14px, 100% 14px;
  background-attachment: local, local, scroll, scroll; */
`
export const DisabledMask = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  gap: 10px;
  flex-direction: column;
  flex-wrap: nowrap;
  transition: all .4s ease;

  &::before {
    display: ${props => (props.show ? 'block' : 'none')};
    position: absolute;
    content: '';
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: #fff;
    opacity: .7;
    z-index: 2;
  }
`
export const DataTitleBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin: 15px 0;
  gap: 15px;
  padding-left: 5px;
`
export const DataTitle = styled.div`
  font-size: 1.6rem;
  font-weight: 500;

  @media screen and (max-width: 700px) {
    font-size: 1.8rem;
  }
`
export const DataSubTitle = styled.div`
  font-size: 1.4rem;
  font-weight: 400;

  @media screen and (max-width: 700px) {
    font-size: 1.8rem;
  }
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
  appearance: none;
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

  @media screen and (max-width: 700px) {
    min-width: 0;
    height: 4rem;
    font-size: 1.6rem;
    opacity: 1;
  }
`
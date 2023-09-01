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
export const TilteContainer = styled.div`
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
export const PopoverContainer = styled.div`
  & > button {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 1.8rem;
    font-weight: 500;
    color: #000;
    white-space: nowrap;
  }
`
export const DialogTitle = styled(motion.div)`
  font-size: 1.5rem;
  font-weight: 400;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 10px;
  word-wrap: break-word;

  @media screen and (max-width: 700px) {
    font-size: 2rem;
    font-weight: 500;
  }
`
export const DialogItem = styled(motion.div)`
  position: relative;
  margin-left: 10px;
  background: transparent;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.5rem;
  font-weight: 400;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  transition: all .4s;

  @media screen and (max-width: 700px) {
    font-size: 1.8rem;
  }
`
export const Menu = styled.div`
  display: flex;
  position: relative;
  margin-left: 5px;
  margin-bottom: 25px;
  z-index: 99;
  background: #fff;

  @media screen and (max-width: 700px) {
    position: sticky;
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

  & > a{
    font-size: 1.3rem;
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
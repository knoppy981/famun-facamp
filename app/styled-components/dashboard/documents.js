import styled from 'styled-components'
import { Form, Link } from '@remix-run/react'
import { motion } from 'framer-motion'
import { FiFile, FiTrash, FiTrash2 } from "react-icons/fi";

const color1 = "#192638"
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
  gap: 15px;
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
export const Menu = styled.div`
  display: flex;
  gap: 25px;
  z-index: 99;
  background: #fff;

  @media screen and (max-width: 700px) {
    position: sticky;
    padding: 10px 15px;
    overflow-x: scroll;
    overflow-y: hidden;
    top: 45px;
    border-radius: 0;

    box-shadow: ${p => p.isSticky ? "1px 0 1px 1px #E6E6E6" : "none"};
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
  white-space: nowrap;

  ${p => p.colorItem && "padding: 0;"}

  @media screen and (max-width: 700px) {
    border-radius: 25px;
    border: 1px solid #e6e6e6;
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
export const Container = styled.div`
`
export const Item = styled.div`
  height: 4.5rem;
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 1.5rem;
  border-bottom: 1px solid #e6e6e6;
`
export const ItemTitle = styled.p`
  width: 300px;
  color: #000;
  font-size: inherit;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: 15px;
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
  cursor: pointer;

  svg {
    transform: translateY(-1px);
  }
  
`
export const ItemDropDown = styled(motion.ul)`
  display: flex;
  flex-direction: column;
  gap: 5px;
`
export const DocumentInputBox = styled(motion.li)`
  display: flex;
  align-items: center;
  gap: 5px;
`
export const DocumentTitle = styled.div`
  font-size: 1.4rem;
  color: #000;
`
const Span = styled.span`
  --_h: none;
  display: flex;
  gap: 5px;
  color: #A7A7A7;
  font-size: 1.4rem;
  transition: .2s all ease;
  cursor: pointer;

  &:hover {
    color: #000;
    --_h: block;
  }
`
export const TrashIcon = styled(FiTrash2)`
  display: var(--_h, none);
  transition: .2s all ease;

  &:hover {
    color: #d61f0a;
  }
`
export const TruncatedFilename = ({ filename, maxLength, ...props }) => {
  const dotIndex = filename.lastIndexOf('.');
  const base = filename.slice(0, dotIndex);
  const ext = filename.slice(dotIndex + 1);
  const truncatedBase = base.length > maxLength
    ? `${base.substring(0, maxLength - 3)}...${base.substring(dotIndex - 3, dotIndex)}`
    : base;
  
  return (
    <Span title={filename} {...props}>
      <FiFile />
      {`${truncatedBase}.${ext}`}
      <TrashIcon />
    </Span>
  );
}
export const FileInput = styled.input.attrs({ type: 'file' })`

`;
export const Blur = styled(motion.div)`
  position: fixed;
  z-index: 998;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
`
export const FileInputContainer = styled.div`
  position: fixed;
  z-index: 999;
  width: 550px;
  padding: 20px;
  background: ${color1};
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 10px;
  color: #fff;
  font-size: 1.8rem;

  p {
    margin-top: 5px;
    font-size: 1.4rem;
  }
`
export const FileInputClose = styled.button`
  position: absolute;
  top: -30px;
  left: 10px;
  outline: none;
  border: none;
`
export const FileForm = styled(Form)`
  height: 300px;
  width: 100%;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  border: 2px dashed #fff;
  gap: 15px;
  color: #fff;
  font-size: 1.4rem;
  background: ${p => p.dragging ? "rgba(255,255,255, .3)" : "transparent"};
`
export const SelectFileButton = styled.button`
  width: 150px;
  height: 3.6rem;
  color: ${p => p.color === 'red' ? begeBackground : p.color === 'green' ? verdeBackground : azulBackground};
  background: ${p => p.color === 'red' ? begeClaro : p.color === 'green' ? verdeClaro : azulCeu};
  outline: none;
  border-radius: 1.8rem;
  font-size: 1.5rem;
`
export const ImagePreview = styled.div`
  position: relative;
  width: 300px;
  height: 170px;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;

  &:hover div {
    display: flex;
  }
`
export const DeleteImagePreview = styled.div`
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,.7);
  gap: 5px;
  color: #fff;
`
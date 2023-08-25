import styled from "styled-components"
import { Form } from "@remix-run/react"
import { motion } from "framer-motion"
import { useRef } from "react"

const color1 = "#192638"
const azulClaro = '#BDE8F5'
const azul = '#01558A'
const azulCeu = '#14A7D8'
const azulEscuro = '#183567'
const azulBackground = "#EDF9FC"
const verdeClaro = "#51b85a"
const verdeBackground = "#EBFDEE"
const begeClaro = "#d57748"
const begeBackground = "#FFEFE1"

export const Wrapper = styled.div`
  position: absolute;
  right: 5%;
  top: 5%;
  z-index: 799;
`
export const ToggleButton = styled.button`
  border: 0;
  outline: none;
  display: flex;
  gap: 10px;
  font-size: 1.6rem;
  cursor: pointer;

  svg {
    font-size: 2rem;
    transform: translateY(1px);
  }
`
export const Container = styled(motion.div)`
  position: absolute;
  z-index: 798;
  top: 150%;
  right: 0;
  width: 30rem;
  background: ${color1};
  box-shadow: 0px 3px 5px -2px #000000;
  border-radius: 10px;
  transform-origin: 26rem 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;

  @media screen and (max-width: 700px) {
    width: 90vw;
    right: 0;
    gap: 15px;
    transform-origin: 85vw 0;
  }
`
export const Arrow = styled(motion.div)`
  position: absolute;
  top: 0;
  right: 4rem;
  height: 10px;
  width: 10px;
  border-radius: 2px;
  background: ${color1};
  border-radius: 2px;
  transform: translateY(-50%) rotate(45deg);
`
export const Title = styled(motion.div)`
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
export const Item = styled(motion.div)`
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

  &:hover {
    ${p => !p.noHover && '--_p: #fff; transform: translateX(10px);'}
  }

  &::before {
    position: absolute;
    content: '';
    top: 50%;
    left: -15px;
    transform: translateY(-50%);
    height: 4px;
    width: 4px;
    border-radius: 2px;
    transition: background .4s;
    background: var(--_p, transparent);
  }

  @media screen and (max-width: 700px) {
    font-size: 1.8rem;
  }
`
export const BiggerItem = styled.div`
  position: relative;
  margin-left: 10px;
  background: transparent;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.8rem;
  font-weight: 500;
  color: #fff;
  letter-spacing: 1px;

  @media screen and (max-width: 700px) {
    font-size: 2rem;
  }
`
export const CopyToClipBoardLabel = ({ value, text, icon }) => {
  const inputRef = useRef(null);

  const copyToClipboard = (e) => {
    e.preventDefault();
    /* if (inputRef.current) {
      navigator.clipboard.writeText(inputRef.current.value).then(() => {
        // Success feedback here
        console.log('Text copied to clipboard');
      }, () => {
        // Failure feedback here
        console.error('Failed to copy text');
      });
    } */
    if (inputRef.current) {
      inputRef.current.select(); 
      document.execCommand('copy'); 
      inputRef.current.blur();

      // You may want to provide feedback to the user that the value was copied.
      console.log('Text copied to clipboard');
    }
  };

  return (
    <>
      <Title onClick={copyToClipboard}>{text} {icon}</Title>

      <ReadOnlyInput onClick={copyToClipboard} ref={inputRef} readOnly value={value} />
    </>
  );
};
export const ColorItem = styled.button`
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 15px;
  border-radius: 1.5rem;
  gap: 5px;
  color: ${p => p.color === 'red' ? begeBackground : p.color === 'green' ? verdeBackground : azulBackground};
  background: ${p => p.color === 'red' ? begeClaro : p.color === 'green' ? verdeClaro : azulCeu};
  font-size: 1.4rem;

  &:disabled {
    opacity: .6;
  }

  @media screen and (max-width: 700px) {
    height: 4rem;
    font-size: 1.6rem;
    border-radius: 2rem;
    gap: 7px;
    opacity: 1;
    font-weight: 500;
  }
`
export const Button = styled.button`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
`
export const NacionalityFlag = styled.div`
  height: 2.5rem;
  width: 2.5rem;
  background-size: contain;
  background-position: 50%;
  background-repeat: no-repeat;

  @media screen and (max-width: 700px) {
    height: 3.2rem;
    width: 3.2rem;
  }
`
export const ReadOnlyInput = styled.input`
  height: 4rem;
  border-radius: 5px;
  border: 1px solid #E6E6E6;
  outline: none;
  padding: 0 10px;
  font-size: 1.5rem;
  background: transparent;
  color: #fff;

  @media screen and (max-width: 700px) {
    height: 5.2rem;
    font-size: 1.8rem;
  }
`
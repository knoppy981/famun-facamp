import { motion } from "framer-motion";
import styled from "styled-components";

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

export const Arrow = styled.svg`
  position: absolute;
  fill: ${color1};
  stroke: ${color1};
  stroke-width: 1px;
  width: 12px;
  height: 12px;

  &[data-placement="top"] {
    top: 100%;
    transform: translateX(-50%);
  }

  &[data-placement="bottom"] {
    bottom: 100%;
    transform: translateX(-50%) rotate(180deg);
  }

  &[data-placement="left"] {
    left: 100%;
    transform: translateY(-50%) rotate(-90deg);
  }

  &[data-placement="right"] {
    right: 100%;
    transform: translateY(-50%) rotate(90deg);
  }
`
export const Wrapper = styled(motion.div)`
  position: absolute;
  z-index: 1;
  transform-origin: center 0;
  background: ${color1};
  box-shadow: 0px 3px 5px -2px #000000;
  border-radius: 10px;

  @media screen and (max-width: 700px) {
    margin: 0 auto;
    width: 90vw;
    left: 50% !important;
    transform: translateX(-50%);
    display: flex;
  }
`
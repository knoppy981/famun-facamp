import styled from "styled-components";
import { FiChevronRight } from "react-icons/fi";
import { Form, Link } from "@remix-run/react";

const azulClaro = '#BDE8F5'
const azul = '#01558A'
const azulCeu = '#14A7D8'
const azulEscuro = '#183567'
const azulBackground = "#EDF9FC"

export const Wrapper = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  @media screen and (max-width: 500px) {
    overflow: hidden;
    height: 100vh; /* Fallback for browsers that do not support Custom Properties */
    height: calc(var(--full-height, 1vh) * 100);;
	}
`
export const ExternalButtonWrapper = styled.div`
  position: absolute;
  left: 5%;
  top: 5%;
  height: 40px;
`
export const ExternalButton = styled(Link)`
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
export const Container = styled.div`
  height: 70vh;
 	width: 400px;
  display: flex;
  flex-direction: column;
  gap: 40px;

	@media screen and (max-width: 500px) {
    width: auto;
    max-width: 100vw;
    margin: 0 20px;
    gap: 0;
	}
  
  @media screen and (max-width: 500px) and (min-height: 700px) {
    height: 100vh; /* Fallback for browsers that do not support Custom Properties */
    height: calc(var(--full-height, 1vh) * 80);
    margin-top: calc(var(--full-height, 1vh) * 15);
    margin-bottom: calc(var(--full-height, 1vh) * 5);
    width: 100vw;
    width: calc(var(--full-width, 1vh) * 94);
    margin-left: calc(var(--full-width, 1vh) * 3);
    margin-right: calc(var(--full-width, 1vh) * 3);
	}
`
export const TitleBox = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  width: 426px;
  
  @media screen and (max-width: 800px) {
    height: auto;
  }

  @media screen and (max-width: 500px) {
    height: auto;
    flex-direction: column;
    align-items: flex-start;
  }

  @media screen and (max-width: 350px) {
    height: auto;
    width: 100vw;
  }
`
export const AuxDiv = styled.div`
  align-items: center;
  display: flex;

  @media screen and (max-width: 500px) and (min-height: 700px) {
    display: none;
	}
`
export const Title = styled.div`
  font-size: 3.6rem;
  font-weight: 900;
  color: #183567;
  margin-right: 5px;

  @media screen and (max-width: 800px) {
    font-size: 4.2rem;
  }

  @media screen and (max-width: 500px) {
    font-size: 4.8rem;
  }

  @media screen and (max-width: 350px) {
    font-size: 3rem;
  }
`
export const SubTitle = styled.div`
  font-size: 2.4rem;
  font-weight: 500;
  color: #000;
  transform: translate(0, 1px);

  @media screen and (max-width: 800px) {
    font-size: 2.8rem;
  }

  @media screen and (max-width: 500px) {
    font-size: 3.2rem;
  }

  @media screen and (max-width: 350px) {
    font-size: 3rem;
  }
`
export const ArrowIconBox = styled(FiChevronRight)`
  height: 25px;
  width: 25px;
  color: #000;
  display: flex;
  align-items: bottom;
`
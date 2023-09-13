import styled from "styled-components";
import { FiChevronRight } from "react-icons/fi";
import { Form } from "@remix-run/react";

const azulClaro = '#BDE8F5'
const azul = '#01558A'
const azulCeu = '#14A7D8'
const azulEscuro = '#183567'
const azulBackground = "#EDF9FC"

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`
export const GoBackLinkWrapper = styled.div`
  position: absolute;
  left: 5%;
  top: 5%;
  height: 40px;
  font-size: 1.6rem;
`
export const SubscriptionForm = styled(Form)`
  min-height: 70svh;
  margin: 15vh 0;
 	width: 400px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  
  @media screen and (max-width: 500px) and (min-height: 700px) {
    gap: 20px;
    margin: 100px 0 50px;
    width: 100vw;
    padding: 0 15px;
	}
`
export const TitleBox = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  width: 400px;
  
  @media screen and (max-width: 800px) {
    height: auto;
  }

  @media screen and (max-width: 500px) {
    height: auto;
    flex-direction: column;
    align-items: flex-start;
    width: auto;
    margin-left: 0;
    margin-right: auto;

    svg {
      display: none;
    }
  }

  @media screen and (max-width: 350px) {
    height: auto;
    width: 100vw;
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

  @media screen and (max-width: 500px) and (min-height: 700px) {
    display: none;
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
export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  @media screen and (max-width: 500px) and (min-height: 700px) {
	}
`
export const ControlButtonsContainer = styled.div`
  margin-top: auto;
  margin-bottom: 0;
  align-self: center;
  display: flex;
  justify-content: center;
  flex-direction: row-reverse;
  gap: 15px;

  > * {
    width: 150px;
  }
`
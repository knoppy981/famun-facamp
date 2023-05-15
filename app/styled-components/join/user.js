import styled from "styled-components";
import { Form } from "@remix-run/react";

const azulClaro = '#BDE8F5'

export const StepsForm = styled(Form)`
  height: calc(70vh - 80px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;

  @media screen and (max-width: 500px) and (min-height: 700px) {
    height: 70vh; /* Fallback for browsers that do not support Custom Properties */
    height: calc((var(--full-height, 1vh) * 80) - 72px);;
	}
`
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px 0 0 0;
  width: 100%;

  @media screen and (max-width: 500px) and (min-height: 700px) {
	}
`
export const ControlButtonsContainer = styled.div`
  margin-bottom: 0;
  margin-top: auto;
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  gap: 15px;
`
export const ControlButton = styled.button`
  height: 4.5rem;
  width: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  background: ${p => !p.prev ? azulClaro : "transparent"};
  box-shadow: 0px 2px 5px -2px #000000;
  border: 1px solid ${p => !p.prev ? 'transparent' : '#E6E6E6'};
  color: #000;
  border-radius: 5px;
	font-size: 1.5rem;
  transition: .4s all ease;

  @media screen and (max-width: 500px) and (min-height: 700px) {
    height: 5.2rem;
    font-size: 1.8rem;
	}
`
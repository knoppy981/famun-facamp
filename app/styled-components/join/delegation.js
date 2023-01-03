import styled from "styled-components";
import { Form } from "@remix-run/react";

const azulClaro = '#BDE8F5'

export const StepsForm = styled(Form)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
`
export const ControlButtonsContainer = styled.div`
  margin: auto 0 0;
  display: flex;
  gap: 15px;
`
export const ControlButton = styled.button`
  height: 45px;
  width: 150px;
  background: ${p => !p.prev ? azulClaro : "transparent"};
  box-shadow: 0px 2px 5px -2px #000000;
  border: 1px solid ${p => !p.prev ? 'transparent' : '#E6E6E6'};
  color: #000;
  border-radius: 5px;
	font-size: 1.5rem;
  transition: .4s all ease;
`
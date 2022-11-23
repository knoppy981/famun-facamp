import styled from "styled-components";
import { FiChevronRight } from "react-icons/fi";
import { Form } from "@remix-run/react";

const azulClaro = '#BDE8F5'
const azul = '#01558A'
const azulCeu = '#14A7D8'
const azulEscuro = '#183567'
const azulBackground = "#EDF9FC"

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
	font-size: 15px;
  transition: .4s all ease;
`
export const StepTitle = styled.h3`
  font-size: 22px;
  font-weight: 500;
  color: #000;
  padding-left: 5px;
`
export const StepSubtitle = styled.p`
  font-size: 14px;
  color: #000;
`
export const InputContainer = styled.div`
  max-width: 900px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 10px;
`
export const SubInputContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`
// checkbox
export const CheckBoxGrid = styled.div`
  display: flex;
  gap: 30px;
`
export const CheckBoxWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  border: 1px solid #e6e6e6;
  border-radius: 10px;
  min-width: 350px;
  height: auto;
  margin-bottom: auto;
  margin-top: 0;
`
export const CheckBoxTitle = styled.div`
  font-size: 14px;
  font-weight: 900;
  display: flex;
  gap: 5px;
  color: ${props => props.err ? '#d61f0a' : '#000'};

  svg {
    height: 15px;
    width: 15px;
    transform: translateY(2px);
  }
`
export const CheckBoxContainer = styled.div`
  height: 30px;
  padding-left: 5px;
  display: flex;
  gap: 15px;
  align-items: center;
`
export const CheckBox = styled.input`
  transform: translateY(-1px);
`
export const CheckBoxLabelContainer = styled.div`

`
export const CheckBoxLabel = styled.label`
  font-size: 14px;
`
// social media and role
export const SMContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: ${p => p.padding ? "20px 20px 10px" : "20px"};
  border: 1px solid #e6e6e6;
  border-radius: 10px;
  min-width: 550px;
  height: auto;
  margin-bottom: auto;
  margin-top: 10px;
`
export const SMLabel = styled.div`
  font-size: 14px;
  font-weight: 900;
`
export const SMAddContainer = styled.div`
  height: 30px;
  display: flex;
  gap: 30px;
  align-items: center;
`
export const SMAdd = styled.select`
  width: 120px;
  height: 100%;
  outline: none;
  border-radius: 5px;
  padding: 5px;
  font-size: 14px;
`
export const SMAddOption = styled.option`

`
export const SMInput = styled.input`
  height: 100%;
  flex-grow: 1;
  background: transparent;
  outline: none;
  border: none;
  font-size: 14px;
  transition: all .4 ease;
  color: #000;
  border-bottom: 1px solid #A7A7A7;
  padding: 0 5px;
  -webkit-text-fill-color: #000 !important;

  &::placeholder {
    opacity: .6;
    font-style: italic;
  }
`
export const SMButton = styled.button`
  height: 100%;
  width: 80px;
  background: transparent;
  border-radius: 5px;
	font-size: 14px;
  transition: .4s all ease;
  margin-left: auto;
  margin-right: 0;

  &:disabled {
    color: #666666;
  }
`
export const SMValueList = styled.ul`
`
export const SMValueItem = styled.li`
  height: 30px;
  display: flex;
  gap: 30px;
  align-items: center;
  cursor: pointer;

  div {
    opacity: ${p => p.active ? "1" : ".5"};
  }
`
export const SMName = styled.div`
  width: 120px;
  font-size: 14px;
  padding-left: 10px;
`
export const SMValue = styled.div`
  background: transparent;
  font-size: 14px;
  flex-grow: 1;
  padding: 0 5px;
`
export const SMDeleteButton = styled.button`
  width: 80px;
  display: flex;
  justify-content: center;
  border: none;
  outline: none;
  margin-right: 0;
  margin-left: auto;
  color: #777777;
  transition: all .4s ease;

  &:hover {
    color: #d61f0a;
  }
  
  svg{
    height: 20px;
    width: 20px;
  }
`
export const AdvidorRoleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  border: 1px solid #e6e6e6;
  border-radius: 10px;
  height: auto;
  margin-bottom: auto;
  margin-top: 10px;
`
export const AdvisorRoleSelect = styled.select`
  width: 100%;
  height: 100%;
  outline: none;
  border-radius: 5px;
  padding: 5px;
  font-size: 14px;
`
// confirm
export const ConfirmList = styled.div`
  display: flex;
  max-width: 1000px;
  gap: 80px;
  margin-top: 15px;
  padding-left: 10px;
`
export const ConfirmColumn = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 250px;
  overflow-x: hidden;
`
export const ConfirmItem = styled.li`
  font-size: 15px;
`
export const ConfirmLabel = styled.div`
  font-size: 12px;
  color: #666666;
`
// type buttons
export const StepButtonsContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 25px;
`
export const StepButton = styled.button`
  height: 45px;
  width: 250px;
  background: ${azulClaro};
  border-radius: 5px;
	font-size: 15px;
  transition: .4s all ease;
  box-shadow: 0px 2px 5px -2px #000000;

  &:disabled {
    color: #666666;
  }
  &:hover {
    transform: translateY(-2px);
  }
`

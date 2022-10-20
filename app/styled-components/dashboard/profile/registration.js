import styled from "styled-components"
import { Form } from "@remix-run/react"

export const ItemContainer = styled.div`
  position: relative;
  height: calc(100% - 80px);
  display: flex;
  flex-direction: column;
  grid-gap: 40px;
  margin: 40px;
`
export const ContainerTitle = styled.div`
  font-size: 25px;
  font-weight: 500;
  color: #183567;
`
export const InputWrapper = styled.div`
  height: 100%;
  grid-gap: 25px;
  display: grid;
  grid-template-columns: 1fr 1fr;
`
export const FormContainer = styled(Form)`
  display: flex;
  flex-direction: column;
  grid-gap: 25px;
  grid-column-start: 1;
  grid-column-end: 3;
`
export const PasswordBox = styled.div`
  grid-row-start: 2;
  place-self: end start;
  width: 300px;
  height: 80px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 40px 16px;
`
export const PasswordTitle = styled.div`
	opacity: .6;
  font-size: 14px;
`
export const Password = styled.div`
  grid-row-start: 2;
	font-size: 15px;
	font-weight: 500;
	opacity: .6;
`
export const PasswordEditButton = styled.button`
  grid-row-start: 2;
	border: none;
	outline: none;
	cursor: pointer;
  display: flex;
  gap: 5px;
	opacity: .6;
  transition: opacity .4s ease;

  &:hover {
  	opacity: 1;
  }
  p {
    font-size: 14px;
  }
  svg {
    height: 20px;
    width: 20px;
  }
`
export const SaveChangesButton = styled.button`
  height: 50px;
  width: 300px;
  place-self: end end;
  background: #183567;
  color: #fff;
  opacity: 1;
  transition: background .4s ease;

  &:disabled {
    opacity: .6; 
    background: #000;
  }
`
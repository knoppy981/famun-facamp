import styled from "styled-components"
import { FiEdit } from "react-icons/fi";

export const ValueBox = styled.div`
  height: 40px;
  width: 100%;
  border: 1px solid #E6E6E6;
  border-radius: 15px;
  display: flex;
	position: relative;
  padding: 0 10px;
`
export const KeyLabel = styled.label`
  position: absolute;
	transform: scale(.85) translate(-0%, -35px);
	transform-origin: left;
	opacity: ${p => p.focused ? '0' : '.6'};
	bottom: 10px;
	transition: all 0.3s ease;
`
export const ValueLabel = styled.label`
  position: absolute;
  cursor: text;
	transform: ${p => p.focused ? 'scale(.85) translate(-0%, -30px)' : ''};
	transform-origin: left;
	opacity: ${p => p.focused ? 1 : .6};
	color: ${p => p.err ? '#d61f0a' : '#000'};
	align-self: flex-end;
	bottom: 10px;
  z-index: 6;
	transition: all 0.6s ease;
`
export const ValueInput = styled.input`
	align-self: flex-end;
  width: 100%;
  height: 40px;
  outline: none;
  border: none;
  font-size: 17px;
  font-weight: 400;
  transition: 0.3s all ease;
  -webkit-text-fill-color: #000 !important;

  &::placeholder {
    opacity: .6;
  }
  &:disabled {
    opacity: 0;
  }
`
export const EditButton = styled.button`
  height: 20px;
  width: 20px;
  place-self: center ;
  transition: opacity .4s ease;
  opacity: ${p => p.focused ? 1 : .6};

  &:hover {
    opacity: 1;
  }
  svg {
    height: 20px;
    width: 20px;
  }
  &:disabled {
    display: none;
  }
`
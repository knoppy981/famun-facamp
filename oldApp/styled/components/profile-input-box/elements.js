import styled from "styled-components"
import { FiEdit } from "react-icons/fi";

export const ValueContainer = styled.div`
  height: 50px;
  width: 70%;
  display: grid;
  grid-template-columns: 9fr 1fr;
`
export const ValueBox = styled.div`
  height: 100%;
  display: flex;
	position: relative;

  --s: 2px;   
  --c: ${p => p.err ? '#d61f0a' : '#000'};
  --a: ${p => p.err ? '#d61f0a' : 'rgb(180,180,180)'};

  padding-bottom: var(--s);
  // color postion // size
  background: 200% 100%, 
    linear-gradient(90deg, var(--c) 50%, var(--a) 50%) calc(100% - ${p => p.focused ? '100%' : '0%'}) 100% / 200% var(--s) no-repeat;
  transition: .4s ease-in-out;
  background-clip: text, padding-box;
  -webkit-background-clip: text, padding-box;
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
	transform: ${p => p.focused ? 'scale(.85) translate(-0%, -35px)' : ''};
	transform-origin: left;
	opacity: .6;
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
  place-self: center;
  
  &:disabled {
    display: none;
  }
`
export const EditIcon = styled(FiEdit)`
  height: 100%;
  width: 100%;
  opacity: ${p => p.focused ? 1 : .6};
  transition: all 0.4s ease;
  cursor: pointer;

  &:hover{
    opacity: 1;
  }
`
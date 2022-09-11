import styled from "styled-components";

import { Form } from "@remix-run/react";

export const Wrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  flex-direction: column;
  margin: 80px;
  grid-gap: 15px;
`
export const Title = styled.div`
  font-size: 40px;
  font-weight: 500;
  color: #fff;
`
export const Subtitle = styled.div`
  font-size: 24px;
  opacity: .8;
  color: #fff;
`
export const AuthForm = styled(Form)`
  margin: 30px 0 0 0;
  display: flex;
  align-items: center;
	grid-gap: 15px;
`
export const Label = styled.label`
	font-size: 20px;
  display: flex;
  align-items: center;
  padding: 0 10px; 
  transition: .4s ease-in-out;
  color: ${props => props.focus ? '#E2D650' : 'rgba(226, 214, 80, .6)'};
`
export const InputContainer = styled.div`
  position: relative;
  width: 130px;

  --s: 2px;   
  --c: #E2D650;
  --a: rgba(226, 214, 80, .6);

  padding-bottom: var(--s);
  // color postion // size
  background: 200% 100%, 
    linear-gradient(90deg, var(--c) 50%, var(--a) 50%) calc(100% - ${props => props.focus ? '100%' : '0%'}) 100% / 200% var(--s) no-repeat;
  transition: .4s ease-in-out;
  background-clip: text, padding-box;
  -webkit-background-clip: text, padding-box;
`
export const Input = styled.input`
	align-self: flex-end;
  padding-left: 15px;
  width: 100%;
  height: 40px;
  outline: none;
  border: none;
  font-size: 20px;
  font-weight: 400;
  transition: 0.2s all ease;
  background: transparent;
  color: #fff;

  -webkit-text-fill-color: #fff !important;

	&:focus {
    display: inline-block;
  }
  &:focus::placeholder{

	}
  &::placeholder {
    
  }

	@media screen and (max-width: 1200px) {
    height: 40px;
	}

	@media screen and (max-width: 800px) {
		height: 50px
	}
`
export const Error = styled.div`
	color: #d61f0a;
	font-size: 12px;
	position: absolute;
	top: 100%;
`
export const Button = styled.button`
  width: 180px;
  height: 100%;
  border-radius: 25px;
  margin-left: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.4s all ease;
  color: ${props => props.disabled ? "rgba(226, 214, 80, .6)" : "#E2D650"};
  border: ${props => props.disabled ? "2px solid rgba(226, 214, 80, .6)" : "2px solid #E2D650"};
`
export const Image = styled.img`
  width: 500px;
  height: auto;
  margin-top: 40px;
`
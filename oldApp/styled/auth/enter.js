import styled from "styled-components";

import { Form } from "@remix-run/react";

export const Wrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  flex-direction: column;
  grid-gap: 15px;
`
export const Title = styled.div`
  font-size: 35px;
  font-weight: 500;
  color: #183567;
`
export const Subtitle = styled.div`
  font-size: 16px;
  color: #666666;
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
  color: ${props => props.focus ? '#2B5EB6' : '#666666'};
`
export const InputContainer = styled.div`
  position: relative;
  width: 130px;

  --s: 2px;   
  --c: #000;
  --a: #666666;

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
  color: #000;

  -webkit-text-fill-color: #000 !important;

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
  height: 40px;
  border-radius: 25px;
  margin-left: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.4s all ease;
  color: ${props => props.disabled ? "#666666" : "#2B5EB6"};
  border: ${props => props.disabled ? "2px solid #666666" : "2px solid #2B5EB6"};
`
export const Image = styled.img`
  width: 500px;
  height: auto;
  margin-top: 40px;
`
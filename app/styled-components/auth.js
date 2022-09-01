import styled from 'styled-components'
import { Link, Form } from '@remix-run/react'

export const Wrapper = styled.div`
	height: 100vh;
	width: 100vw;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
`
export const Logo = styled.div`
	height: 140px;
	width: 120px;
	background-position: center;
  background-size: 100%;
	background-repeat: no-repeat;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 30px;
	letter-spacing: 1px;
	color: #005fcc;

	@media screen and (max-width: 1100px) {
		font-size: 60px;
	}

	@media screen and (max-width: 400px) {
		font-size: 40px;
	}
	
`
export const FormContainer = styled.div`
	display: flex;
  align-items: center;
  flex-direction: column;
  width: 500px;
	grid-gap: 25px;

	@media screen and (max-width: 1400px) {
		width: 60%;
	}

	@media screen and (max-width: 1100px) {
		width: 80%;
	}

	@media screen and (max-width: 800px) {
    width: 100%;
	}
`
export const AuthForm = styled(Form)`
  display: flex;
  flex-direction: column;
  align-items: center;
	width: 80%;
	grid-gap: 15px;
`
export const DividedInputWrapper = styled.div`
	width: 100%;
	display: grid;
	grid-template-columns: ${props => props.gridSpace};
	grid-gap: 15px;
`
export const InputWrapper = styled.div`
	width: 100%;
`
export const Label = styled.label`
	font-size: 14px;

	@media screen and (max-width: 300px) {
    font-size: 10px;
	}
`
export const InputContainer = styled.div`

`
export const Input = styled.input`
	width: 100%;
	height: 35px;
	border: 1px solid #000;
	border-radius: 4px;

	&:focus {
    display: inline-block;
  }
  &:focus::placeholder{

	}
  &::placeholder {
    
  }

	@media screen and (max-width: 1400px) {
    height: 40px;
		font-size: 25px;
	}

	@media screen and (max-width: 1100px) {
    height: 60px;
		font-size: 22px;
	}

	@media screen and (max-width: 800px) {
    height: 60px;
		font-size: 22px;
	}

	@media screen and (max-width: 400px) {
    height: 50px;
		font-size: 22px;
	}

	@media screen and (max-width: 300px) {
    height: 40px;
		font-size: 18px;
	}
`
export const Error = styled.div`
	color: #d61f0a;
	font-size: 12px;
`
export const SubmitButton = styled.button`
	background: #005fcc;
	border: 1px solid #fff;
	color: #fff;
	border-radius: 5px;
	width: 30%;
	height: 35px;
	margin-top: 50px;
	cursor: pointer;

	@media screen and (max-width: 1400px) {
		height: 60px;
		width: 50%;
		font-size: 20px;
		margin-top: 30px;
	}

	@media screen and (max-width: 600px) {
		height: 50px;
		width: 50%;
		font-size: 20px;
		margin-top: 30px;
	}
`
export const LinkContainer = styled.div`
	margin-top: 40px;
	font-size: 14px;

	@media screen and (max-width: 1400px) {
		font-size: 20px;
	}
	@media screen and (max-width: 400px) {
		font-size: 18px;
		margin-top: 20px;
	}
	@media screen and (max-width: 300px) {
		font-size: 13px;
	}
`
export const FormLink = styled(Link)`
	text-decoration: underline;
	color: blue;
`
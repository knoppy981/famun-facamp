import styled from 'styled-components'
import { Link, Form } from '@remix-run/react'

export const Wrapper = styled.div`
	margin: 100px auto;
	width: 60vw;
	display: grid;
	justify-items: center;
	font-weight: 300;

	@media screen and (max-width: 1200px) {
		grid-template-columns: 1fr;
	}

	@media screen and (max-width: 600px) {
		width: 100vw;
	}
`
export const FormContainer = styled.div`
	display: flex;
  align-items: center;
  flex-direction: column;
	grid-gap: 25px;
	width: 70%;
	z-index: 4;

	@media screen and (max-width: 1100px) {
		width: 90%;
	}

	@media screen and (max-width: 900px) {
		width: 100%;
	}
`
export const Title = styled.div`
	width: 80%;
	display: flex;
	justify-content: center;
	font-weight: 500;
	color: #183567;
	font-size: 30px;
`
export const StepsContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	height: 50px;
	width: 60%;
	grid-gap: 15px;

	@media screen and (max-width: 800px) {
		width: 80%;
	}
`
export const Step = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	opacity: ${props => props.active === 'gray' ? 0.3 : 1};
	color: ${props => props.active === 'green' ? "green" : "#000"};
	border-bottom: 2px solid ${props => props.active === 'green' ? "green" : "#000"};
`
export const AuthForm = styled(Form)`
  display: flex;
  flex-direction: column;
  align-items: center;
	width: 80%;
	min-height: 300px;
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
	position: relative;
`
export const Input = styled.input`
	width: 100%;
	height: 45px;
	padding: 10px;
	border: 1px solid #000;
	font-size: 16px;
	border-radius: 4px;

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
export const DelegationButtonsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 45px;
	margin: 50px 0;
`
export const DelegationButton = styled.button`
  height: 80px;
  width: 100%;
  border: 2px solid #183567;
  border-radius: 5px;
  padding: 15px;
  transition :0.4s all ease;

  &:hover {
    color: #2B5EB6;
    border: 2px solid #2B5EB6;
  }
`
export const ButtonContainer = styled.div`
	margin-top: 10px;
	width: 100%;
	height: 45px;
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	justify-items: center;
	align-items: center;

	@media screen and (max-width: 800px) {
		grid-template-columns: 1fr 2fr 1fr;
	}
`
export const SubmitButton = styled.button`
	background: #2B5EB6;
	border: 1px solid #fff;
	color: #fff;
	border-radius: 5px;
	width: 100%;
	height: 100%;
	cursor: pointer;

	@media screen and (max-width: 1200px) {
		font-size: 20px;
	}

	@media screen and (max-width: 600px) {
		
	}
`
export const LinkContainer = styled.div`
	font-size: 16px;

	@media screen and (max-width: 1200px) {
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
export const LogoContainer = styled.div`
	justify-self: start;

	@media screen and (max-width: 1200px) {
		display: none;
	}
`
export const LogoText = styled.div`
	font-weight: 500;
	color: #183567;
	font-size: 50px;
	display: flex;
	align-items: center;
	margin-top: 50px;
	font-family: "Panton";
	font-weight: 800;
`
export const Logo = styled.img`
	height: 200px;
	width: auto;
	z-index: 3;
`
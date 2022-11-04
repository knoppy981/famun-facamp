import styled from 'styled-components'
import { Link, Form } from '@remix-run/react'

export const Wrapper = styled.div`
	display: flex;
  width: 100%;
  align-items: center;
	justify-content: center;
  color: #fff;
  grid-gap: 15px;
`
export const FormContainer = styled.div`
	display: flex;
  flex-direction: column;
	grid-gap: 45px;
	width: 600px;
	z-index: 4;

	@media screen and (max-width: 1100px) {
	}

`
export const Subtitle = styled.div`
	font-size: 16px;
	font-weight: 100;
	color: #666666;
	
	h3 {
		color: #183567;
		font-size: 30px;
	}
`
export const AuthForm = styled(Form)`
	width: 100%;
  color: #fff;
`
export const FormStepsContainer = styled.div`
  display: flex;
	flex-wrap: nowrap;
	flex-direction: row;
  overflow: hidden;
  width: 600px;
`
export const StepContainer = styled.div`
  width: 100%;
	flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
	grid-gap: 15px;
  transition: all .4s ease;
`
export const DividedInputWrapper = styled.div`
	width: 100%;
	display: grid;
	grid-template-columns: ${props => props.gridSpace};
	grid-gap: 15px;
`
export const Error = styled.div`
	color: #d61f0a;
	font-size: 12px;
	position: absolute;
	top: 100%;
`
export const ButtonContainer = styled.div`
	margin-top: 30px;
	width: 100%;
	height: 45px;
  display: flex;
  justify-content: center;
	align-items: center;

	@media screen and (max-width: 800px) {
		grid-template-columns: 1fr 2fr 1fr;
	}
`
export const SubmitButton = styled.button`
  background: #183567;
	border-radius: 5px;
	width: 300px;
	height: 100%;
	cursor: pointer;
  transition: 0.4s all ease;

  p {
    font-weight: 500;
	  color: #fff;
  }
`
export const LinkContainer = styled.div`
	font-size: 16px;
  color: #fff;
`
export const FormLink = styled(Link)`
	text-decoration: underline;
	color: #E2D650;
`
export const GeneralizedErrorBox = styled.div`
	height: 20px;
	width: 100%;
	display: flex;
`
export const GeneralizedError = styled.p`
	display: ${props => props.err ? 'block' : 'none'};
	font-size: 14px;
	color: #d61f0a;
`
import styled from "styled-components";
import { Link, Form } from '@remix-run/react'

export const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;
  grid-gap: 10px;
`
export const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-items: center;
  grid-gap: 50px;
`
export const FormContainer = styled.div`
	display: flex;
  flex-direction: column;
	grid-gap: 5px;
	width: 500px;
  height: 400px;
	z-index: 4;

	@media screen and (max-width: 1100px) {
	}
`
export const Title = styled.div`
  font-size: 35px;
  font-weight: 500;
  color: #183567;
`
export const SubTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #666666;
`
export const AuthForm = styled(Form)`
	width: 100%;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
	grid-gap: 15px;
  margin-top: 60px;
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
export const ImageLinkWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  grid-gap: 25px;
  justify-content: flex-end;
`
export const Image = styled.img`
  width: 500px;
  height: auto;
  align-self: flex-end;
`
export const LinkContainer = styled.div`
	font-size: 16px;
  color: #000;
  justify-self: center;
  grid-column-start: 2;
`
export const LoginLink = styled(Link)`
	text-decoration: underline;
  color: #2B5EB6;
`
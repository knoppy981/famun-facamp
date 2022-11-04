import styled from "styled-components";
import { Link, Form } from '@remix-run/react'
import { FiChevronRight } from "react-icons/fi";

export const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`
export const FormContainer = styled.div`
	width: 400px;

	@media screen and (max-width: 1100px) {
	}
`
export const TitleBox = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 40px;
  height: 40px;
`
export const Title = styled.div`
  font-size: 36px;
  font-weight: 900;
  color: #183567;
  margin-right: 5px;
`
export const SubTitle = styled.div`
  font-size: 24px;
  font-weight: 500;
  color: #000;
  transform: translate(0, 1px);
`
export const ArrowIconBox = styled(FiChevronRight)`
  height: 25px;
  width: 25px;
  color: #000;
  display: flex;
  align-items: bottom;
`
export const AuthForm = styled(Form)`
	width: 100%;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
	grid-gap: 15px;
  margin-bottom: 40px;

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
export const ForgotLinkBox = styled.div`
  color: #000;
  width: 100%;
  display: flex;
`
export const ForgotLink = styled(Link)`
	text-decoration: none;
  font-size: 14px;
  margin-left: 5px;
  height: 19px;
  --s: 1px;
  --c: #666666;
  --a: #000;
  color: transparent;
  padding-bottom: var(--s);
  background: linear-gradient(90deg,var(--a) 50%,var(--a) 0) calc(100% - var(--_p,0%))/200% 100%,
    linear-gradient(var(--c) 0 0) 50% 100%/var(--_p,0%) var(--s) no-repeat;
  transition: .3s ease-in-out;
  background-clip: text, padding-box;
  -webkit-background-clip: text, padding-box;

  &:hover{
    --_p: 100%;
  }
`
export const JoinLinkBox = styled.div`
	font-size: 14px;
  color: #000;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 6px;
`
export const JoinLink = styled(Link)`
  color: transparent;
  height: 19px;
  --s: 1px;
  --c: #666666;
  --a: #000;
  color: transparent;
  padding-bottom: var(--s);
  background: linear-gradient(90deg,var(--a) 50%,var(--a) 0) calc(100% - var(--_p,0%))/200% 100%,
    linear-gradient(var(--c) 0 0) 50% 100%/var(--_p,0%) var(--s) no-repeat;
  transition: .3s ease-in-out;
  background-clip: text, padding-box;
  -webkit-background-clip: text, padding-box;

  &:hover{
    --_p: 100%;
  }
`
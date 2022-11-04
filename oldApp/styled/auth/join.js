import styled from "styled-components";

import { Link } from "@remix-run/react";

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  grid-gap: 10px;
`
export const Container = styled.div`
  display: grid;
  justify-items: center;
  grid-template-columns: 1fr 1fr;
  grid-gap: 50px;
`
export const Info = styled.div`
  display: flex;
  flex-direction: column;
	grid-gap: 5px;
	width: 500px;
  height: 400px;
`
export const Title = styled.div`
  color: #183567;
  font-size: 35px;
  font-weight: 500;
`
export const Subtitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #666666;
  
  p {
    color: #000;
  }
`
export const ButtonsContainer = styled.div`
  margin-top: 60px;
  display: grid;
  grid-gap: 25px;
  margin-top: auto;
  margin-bottom: 0%;
  align-self: center;
`
export const Button = styled.button`
  background: #183567;
	border-radius: 5px;
	width: 500px;
  height: 45px;
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
  align-items: start;
  grid-gap: 25px;
  justify-content: flex-end;
`
export const Image = styled.img`
  width: 400px;
  height: auto;
  align-self: center;
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

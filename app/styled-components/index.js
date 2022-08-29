import styled from "styled-components";
import { Link } from '@remix-run/react'

export const Wrapper = styled.div`

`
export const Container = styled.div`
	height: 100vh;
	width: 100%;
	display: flex;
	align-items: center;
	flex-direction: column;
	/* background: #005fcc; */
	/* color: #fff; */
	padding: 20px;
	margin-top: 50px;

	@media screen and (max-width: 800px) {
	}
`
export const Title = styled.h1`
	font-weight: 500;
	font-size: 30px;
	color: #005fcc;
`
export const Subtitle = styled.h3`
	font-weight: 500;
	font-size: 20px;
	margin: 40px 0;
`
export const List =	styled.div`
	display: flex;
	flex-direction: column;
	grid-gap: 15px;
`
export const ListItem = styled.li`
	font-size: 20px;
`
export const ItemLink = styled(Link)`

`
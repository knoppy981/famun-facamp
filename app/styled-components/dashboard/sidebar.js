import styled from 'styled-components'

import { NavLink } from '@remix-run/react'

export const Sidebar = styled.div`
	height: 100%;
	width: 270px;
	border-right: 1px solid #fff;
	background: #2B5EB6;
`
export const ItemsWrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 45px 0;
	grid-gap: 25px;
`
export const ItemContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	color: #EBEBEB;
	grid-gap: 5px;
`

export const Item = styled.div`
	margin: 0 0 0 25px;
	height: 35px;
	display: flex;
	grid-gap: 10px;
	align-items: center;
	font-size: 16px;
	font-weight: 500;
	
	svg{
		height: 20px;
		width: 20px;
	}
`
export const SubItem = styled(NavLink)`
	font-size: 15px;
	font-weight: 100;
	margin-left: 35px;
`
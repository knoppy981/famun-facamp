import styled from "styled-components";

import { NavLink, Link } from "@remix-run/react";

export const Nav = styled.nav`
	height: 84px;
	width: 100vw;
	display: flex;
	justify-content: center;
	align-items: center;
	position: sticky;
	top: 0;
	z-index: 10;
/* 	-webkit-box-shadow: 0px 3px 24px -1px rgba(0,0,0,0.69); 
	box-shadow: 0px 3px 24px -1px rgba(0,0,0,0.69); */
	background: #183567;
	color: #fff;
`
export const NavContainer = styled.div`
	display: flex;
	height: 100%;
	width: 75%;
	grid-gap: 50px;
`
export const NavLogo = styled(Link)`
	justify-self: flex-start;
	font-size: 34px;
	display: flex;
	align-items: center;
	font-weight: 500;
`
export const NavLogoImage = styled.img`
	width: 200px;

`
export const NavMenu = styled.ul`
	display: flex;
	align-items: center;
	list-style: none;
	text-align: center;
	grid-gap: 40px;
`
export const NavItem = styled(NavLink)`
	height: 100%;
	font-size: 15px;
	display: flex;
	align-items: center;
`
export const UserNavMenu = styled.ul`
	height: 100%;
	justify-self: flex-end;
	display: flex;
	align-items: center;
	list-style: none;
	text-align: center;
	grid-gap: 40px;
	margin-left: auto;
	margin-right: 0%;
`
export const UserButton = styled.div`
	border-radius: 50px;
	height: 60%;
	padding: 20px;
	display: flex;
	align-items: center;
	justify-content: center;

	svg{
		height: 20px;
		width: 20px;
		margin-right: 10px;
	}
`
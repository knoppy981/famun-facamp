import styled from "styled-components";

import { NavLink } from "@remix-run/react";

export const Nav = styled.nav`
	height: 11vh;
	width: 100vw;
	display: flex;
	justify-content: center;
	align-items: center;
	position: sticky;
	top: 0;
	z-index: 10;
	-webkit-box-shadow: 0px 3px 24px -1px rgba(0,0,0,0.69); 
	box-shadow: 0px 3px 24px -1px rgba(0,0,0,0.69);
`
export const NavContainer = styled.div`
	display: flex;
	height: 100%;
	width: 100%;
	padding: 0 50px;
	grid-gap: 50px;
`
export const NavLogo = styled.div`
	color: #000;
	justify-self: flex-start;
	font-size: 34px;
	display: flex;
	align-items: center;
	font-weight: 500;
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
	height: 50%;
	border-radius: 50px;
	padding: 20px;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 1px solid #EBEBEB;
`
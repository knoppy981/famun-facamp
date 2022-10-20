import styled from 'styled-components'

import { NavLink } from '@remix-run/react'

export const Sidebar = styled.div`
	height: 100%;
	min-width: 270px;
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
	grid-gap: 10px;
`
export const MainItemBox = styled.div`
	${props => props.active ?
		'color: #E2D650; border-left: 3px solid #E2D650; background: rgba(226, 214, 80, .4); transition: all 0.4 ease;'
		: 'border-left: 3px solid rgba(0,0,0,0);'}
	
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
export const SubItem = styled.div`
	font-size: 15px;
	font-weight: 100;
	margin-left: 35px;

	--s: 1px;   
  --c: #fff;
  --a: ${'transparent'};

  padding-bottom: var(--s);
  // color postion // size
  background: linear-gradient(90deg,var(--a) 50%,var(--a) 0) calc(100% - var(--_p,0%))/200% 100%, 
    linear-gradient(90deg, var(--c) 50%, var(--a) 50%) calc(100% - ${props => props.active ? '100%' : '0%'}) 100% / 200% var(--s) no-repeat;
  transition: .4s ease-in-out;
  background-clip: text, padding-box;
  -webkit-background-clip: text, padding-box;
`
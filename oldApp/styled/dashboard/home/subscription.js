import styled from "styled-components";

import { Form } from "@remix-run/react";

export const Wrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  flex-direction: column;
  margin: 80px;
  color: #fff;
  grid-gap: 40px;
`
export const Title = styled.div`
  width: 100%;
  font-size: 40px;
  font-weight: 500;
`
export const GridContainer = styled.div`
	width: 100%;
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-gap: 20px;
`
export const GridItem = styled.div`
	height: 140px;
`
export const DividedGridItem = styled.div`
  height: 140px;
  display: grid;
  grid-template-columns: 1fr 1fr;
`
export const ItemTitle = styled.h3`
	font-size: 15px;
	font-weight: 800;
`
export const ItemData = styled.div`
	font-size: 15px;
	font-weight: 500;
	margin: 10px 0 20px;
	opacity: .8;
`
export const ItemButton = styled.button`
  color: rgba(226, 214, 80, .6);
	border: none;
	outline: none;
	cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: 0.4s all ease;

  &:hover {
    color: #E2D650;
  }
`
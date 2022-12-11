import styled from "styled-components";
import { Link } from "@remix-run/react";

const azulClaro = '#BDE8F5'
const azul = '#01558A'
const azulCeu = '#14A7D8'
const azulEscuro = '#183567'
const azulBackground = "#EDF9FC"

export const Container = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70%;
  height: 80vh;
  display: flex;
  flex-direction: column;
  padding: 30px;
  gap: 50px;
`
export const TitleBox = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
`
export const Title = styled.div`
  font-size: 3.6rem;
  font-weight: 900;
  color: ${azulEscuro};
  margin-right: 5px;
`
export const Message = styled.div`
  display: flex;
  gap: 15px;
  font-size: 1.8rem;
  width: 70vw;
  flex-wrap: wrap;
  word-break: normal;
  overflow-wrap:break-word;
`
export const GoBacklink = styled(Link)`
  color: ${azul};
  font-size: 1.8rem;
  text-decoration: underline;
`
export const GoBackButton = styled.button`
  border: none;
  outline: none;
  color: ${azul};
  font-size: 1.8rem;
  text-decoration: underline;
`

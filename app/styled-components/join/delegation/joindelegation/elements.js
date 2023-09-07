import styled from "styled-components";

const azulClaro = '#BDE8F5'
const azulCeu = '#14A7D8'

export const Title = styled.h3`
  font-size: 2.2rem;
  font-weight: 500;
  color: #000;
  margin-left: 5px;
`
export const SubTitle = styled.p`
  font-size: 1.4rem;
  color: #000;
  margin-left: 5px;
`
export const Wrapper = styled.div`
  margin-top: 20px;
  display: grid;
  gap: 30px;
  padding: 5px;
  padding-right: 10px;

  @media screen and (max-width: 500px) and (min-height: 700px) {
    gap: 10px;
	}
`
export const Container = styled.div`
  margin: 10px 0 0 0;
  display: flex;
  flex-direction: column;
	grid-gap: 20px;
`
export const Label = styled.label`
	font-size: 1.8rem;
  display: flex;
  align-items: center;
  padding: 0 10px; 
  transition: .4s ease-in-out;
  color: ${props => props.focus ? '#2B5EB6' : '#000'};
`
export const InputBox = styled.div`
  padding: 0 10px;
  height: 4.5rem;
  border: 1px solid #E6E6E6;
  border-radius: 5px;
  display: flex;

  @media screen and (max-width: 500px) and (min-height: 700px) {
    height: 5.2rem;
	}
`
export const StatusIcon = styled.div`
  height: 100%;
  margin-left: auto;
  margin-right: 0;
  display: flex;
  align-items: center;
  padding-left: 10px;

  svg {
    color: ${p => p.color};
    height: 22px;
    width: 22px;
  }
`
export const Status = styled.div`
  margin-top: 5px;
  padding-left: 10px;
  font-size: 1.6rem;
  color: ${props => props.err ? '#d61f0a' : '#666666'};
`
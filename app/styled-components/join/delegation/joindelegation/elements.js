import styled from "styled-components";

const azulClaro = '#BDE8F5'
const azulCeu = '#14A7D8'

export const Title = styled.h3`
  font-size: 2.2rem;
  font-weight: 500;
  color: #000;
`
export const SubTitle = styled.p`
  font-size: 1.4rem;
  color: #000;
`
export const Wrapper = styled.div`
  max-height: calc(70vh - 245px);
  margin-top: 20px;
  display: grid;
  gap: 30px;
  padding: 5px;
  padding-right: 10px;
  overflow-y: scroll;
  overflow-x: hidden;

  /* background: /* Shadow covers
  linear-gradient(white 30%, rgba(255, 255, 255, 0)), linear-gradient(rgba(255, 255, 255, 0), white 70%) 0 100%, /* Shadows
  radial-gradient(farthest-side at 50% 0, rgba(0, 0, 0, .2), rgba(0, 0, 0, 0)), radial-gradient(farthest-side at 50% 100%, rgba(0, 0, 0, .2), rgba(0, 0, 0, 0)) 0 100%;
  background-repeat: no-repeat;
  background-color: white;
  background-size: 100% 40px, 100% 40px, 100% 14px, 100% 14px;
  Opera doesn't support this in the shorthand
  background-attachment: local, local, scroll, scroll; */

  @media screen and (max-width: 500px) and (min-height: 700px) {
    max-height: 70vh; /* Fallback for browsers that do not support Custom Properties */
    max-height: calc((var(--full-height, 1vh) * 80) - 244px);;
    gap: 10px;
	}
`
export const Container = styled.div`
  margin: 10px 0 0 0;
  display: flex;
  align-items: center;
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
export const Input = styled.input`
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  font-size: 1.6rem;
  transition: all .4 ease;
  color: #000;
  background: transparent;
  -webkit-text-fill-color: #000 !important;
  
  &::placeholder {
    opacity: .6;
    font-style: italic;
  }

  @media screen and (max-width: 500px) and (min-height: 700px) {
    font-size: 1.8rem;
	}
`
export const Button = styled.button`
  height: 4.5rem;
  width: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  background: ${p => !p.prev ? azulClaro : "transparent"};
  box-shadow: 0px 2px 5px -2px #000000;
  border: 1px solid ${p => !p.prev ? 'transparent' : '#E6E6E6'};
  color: #000;
  border-radius: 5px;
	font-size: 1.5rem;
  transition: .4s all ease;

  &:disabled {
    color: #666666;
    background: transparent;
    cursor: not-allowed;
  }

  @media screen and (max-width: 500px) and (min-height: 700px) {
    height: 5.2rem;
    font-size: 1.8rem;
	}

`
export const Status = styled.div`
  margin-top: 5px;
  padding-left: 10px;
  font-size: 1.6rem;
  color: ${props => props.err ? '#d61f0a' : '#666666'};
`
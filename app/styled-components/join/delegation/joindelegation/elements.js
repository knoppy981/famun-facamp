import styled from "styled-components";

const azulClaro = '#BDE8F5'

export const Title = styled.h3`
  width: 426px;
  font-size: 2.2rem;
  font-weight: 500;
  color: #000;
`
export const SubTitle = styled.p`
  width: 426px;
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

  background: /* Shadow covers */
  linear-gradient(white 30%, rgba(255, 255, 255, 0)), linear-gradient(rgba(255, 255, 255, 0), white 70%) 0 100%, /* Shadows */
  radial-gradient(farthest-side at 50% 0, rgba(0, 0, 0, .2), rgba(0, 0, 0, 0)), radial-gradient(farthest-side at 50% 100%, rgba(0, 0, 0, .2), rgba(0, 0, 0, 0)) 0 100%;
  background-repeat: no-repeat;
  background-color: white;
  background-size: 100% 40px, 100% 40px, 100% 14px, 100% 14px;
  /* Opera doesn't support this in the shorthand */
  background-attachment: local, local, scroll, scroll;
`
export const Container = styled.div`
  margin: 30px 0 0 0;
  display: flex;
  align-items: center;
	grid-gap: 5px;
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
  width: 150px;
  height: 45px;
  border: 1px solid #E6E6E6;
  border-radius: 5px;
  display: flex;
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
  height: 45px;
  outline: none;
  border: none;
  font-size: 1.8rem;
  font-weight: 400;
  background: transparent;
  color: #000;

  -webkit-text-fill-color: #000 !important;
`
export const Button = styled.button`
  height: 45px;
  width: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  background: ${azulClaro};
  border-radius: 5px;
	font-size: 1.5rem;
  transition: .4s all ease;
  box-shadow: 0px 1px 5px -2px #000000;
  margin-left: 25px;

  &:disabled {
    color: #666666;
    background: transparent;
    cursor: not-allowed;
  }
  &:hover {
  }
`
export const Status = styled.div`
  margin-top: 5px;
  padding-left: 10px;
  font-size: 1.6rem;
  color: #666666;
`
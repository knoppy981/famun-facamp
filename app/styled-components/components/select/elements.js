import styled from "styled-components";

const azulCeu = '#14A7D8'

export const Label = styled.label`
  margin-left: 5px;
  color: ${props => props.err ? '#d61f0a' : '#000'};
`
export const Box = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  border-radius: 5px;
  border: 1px solid ${p => p.disabled ? "transparent" : '#E6E6E6'};
  outline: none;
  color: #000;
  background: transparent;
  transition: all 0.2s ease-in-out;
  -webkit-text-fill-color: #000 !important;

  button {
    height: 100%;
    width: 100%;
    justify-content: space-between;
  }

  span {
    font-size: inherit;
  }
` 
export const InputBorder = styled.div`
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  opacity: ${p => p.isActive || p.err ? 1 : 0};
  border-radius: 5px;
  box-shadow: 0 0 5px 1px ${p => p.err ? '#d61f0a' : azulCeu};
  transition: all 0.2s ease-in-out;
`
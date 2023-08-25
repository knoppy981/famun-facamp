import styled from "styled-components";

const azulCeu = '#14A7D8'

export const Label = styled.label`
  margin-left: 5px;
  color: ${props => props.err ? '#d61f0a' : '#000'};
`
export const Box = styled.div`
  display: flex;
  align-items: center;
  border-radius: 5px;
  border: 1px solid ${p => p.disabled ? "transparent" : p.err ? '#d61f0a' : '#E6E6E6'};
  outline: none;
  color: #000;
  background: transparent;
  -webkit-text-fill-color: #000 !important;

  &:focus, &:hover {
    border-color: ${p => p.disabled ? "transparent" : p.err ? '#d61f0a' : azulCeu};
  }

  button {
    height: 100%;
    width: 100%;
    justify-content: space-between;
  }

  span {
    font-size: inherit;
  }
` 
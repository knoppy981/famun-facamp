import styled from "styled-components";

const azulCeu = '#14A7D8'

export const Label = styled.label`
  margin-left: 5px;
  color: ${props => props.err ? '#d61f0a' : '#000'};
`
export const Box = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  border-radius: 5px;
  border: 1px solid ${p => p.disabled ? "transparent" : p.err ? '#d61f0a' : p.isFocused ? azulCeu :  '#E6E6E6'};
  padding: 0 10px;
  font-size: 1.6rem;
  color: #000;
  background: transparent;
  font-size: inherit;

  &:focus, &:hover {
    border-color: ${p => p.disabled ? "transparent" : p.err ? '#d61f0a' : azulCeu};
  }

  & > button {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translate(0, -50%);
  }
` 
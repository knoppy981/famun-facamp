import styled from "styled-components";

const azulCeu = '#14A7D8'

export const Label = styled.label`
  margin-left: 5px;
  color: ${props => props.err ? '#d61f0a' : '#000'};
`
export const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  border-radius: 5px;
  border: 1px solid ${p => p.disabled ? "transparent" : p.err ? '#d61f0a' : p.isFocused ? azulCeu :  '#E6E6E6'};
  font-size: 1.6rem;
  gap: 10px;
  color: #000;
  background: transparent;

  &:hover {
    border-color: ${p => p.disabled ? "transparent" : azulCeu};
  }

  & > button {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translate(0, -50%);
  }
`
export const Input = styled.input`
  background: transparent;
  box-sizing: border-box;
  flex: 1;
  font-size: inherit;
  outline: none;
  border: none;
`
export const ButtonContainer = styled.div`
  display: ${p => p.disabled ? "none" : "block"};

  > * {
    padding: 0 10px;
    width: 100%;
    height: 100%;
  }
`
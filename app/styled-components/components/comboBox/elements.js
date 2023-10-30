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
  border: 1px solid ${p => p.disabled ? "transparent" : '#E6E6E6'};
  font-size: 1.6rem;
  gap: 10px;
  color: #000;
  background: transparent;
  transition: all 0.2s ease-in-out;

  --c: ${p => p.err ? '#d61f0a' : azulCeu};
  --o: ${p => p.err ? 1 : 0};

  input:focus ~ div, input:active ~ div {
    --o: 1;
  }

  & > button {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translate(0, -50%);
  }
`
export const Border = styled.div`
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  opacity: var(--o, 0);
  border-radius: 5px;
  box-shadow: 0 0 5px 1px var(--c, "tranparent");
  transition: all 0.2s ease-in-out;
`
export const Input = styled.input`
  background: transparent;
  box-sizing: border-box;
  flex: 1;
  font-size: inherit;
  outline: none;
  border: none;

  &:disabled {
    opacity: 1;
  }
`
export const ButtonContainer = styled.div`
  display: ${p => p.disabled ? "none" : "block"};

  > * {
    padding: 0 10px;
    width: 100%;
    height: 100%;
  }
`
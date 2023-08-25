import styled from "styled-components";

const azulClaro = '#BDE8F5'

export const Title = styled.h3`
  font-size: 2.2rem;
  font-weight: 500;
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
    gap: 20px;
	}
`
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media screen and (max-width: 500px) {
    max-width: calc((var(--full-width, 1vh) * 94) - 15px);
	}

  @media screen and (max-width: 500px) and (min-height: 700px) {
    min-width: auto;
	}
`
export const ContainerTitle = styled.div`
  font-size: 1.4rem;
  gap: 5px;
  color: ${props => props.err ? '#d61f0a' : '#000'};
  word-break: normal;

  b {
    font-size: inherit;
  }

  svg {
    height: 15px;
    width: 15px;
    transform: translateY(2px);
  }

  @media screen and (max-width: 500px) {
    max-width: calc((var(--full-width, 1vh) * 100) - 55px);
    font-size: 1.6rem;
	}
`
export const ReorderableListWrapper = styled.div`
  display: flex;
  gap: 10px;
`
export const ReorderableListContainer = styled.div`
  
`
export const ReordableListIndexes = styled.div`
  display: grid;

  div {
    display: grid;
    align-self: center;
    font-size: 1.4rem;
  }
`
export const CheckBoxWrapper = styled.div`

`
export const CheckBoxContainer = styled.div`
  height: 30px;
  padding-left: 5px;
  display: flex;
  gap: 15px;
  align-items: center;
`
export const CheckBox = styled.input`
  transform: translateY(-1px);
`
export const LabelContainer = styled.div`

`
export const Label = styled.label`
  font-size: 1.4rem;
`
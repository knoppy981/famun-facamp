import styled from "styled-components";

export const Title = styled.h3`
  font-size: 2.2rem;
  font-weight: 500;
  color: #000;
  padding-left: 5px;
`
export const Wrapper = styled.div`
  display: flex;
  gap: 30px;
`
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  border: 1px solid #e6e6e6;
  border-radius: 10px;
  min-width: 350px;
  height: auto;
  margin-bottom: auto;
  margin-top: 0;
`
export const CheckBoxTitle = styled.div`
  font-size: 1.4rem;
  font-weight: 900;
  display: flex;
  gap: 5px;
  color: ${props => props.err ? '#d61f0a' : '#000'};

  svg {
    height: 15px;
    width: 15px;
    transform: translateY(2px);
  }
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
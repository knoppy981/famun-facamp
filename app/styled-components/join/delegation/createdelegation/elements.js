import styled from "styled-components";

const azulCeu = '#14A7D8'

export const Title = styled.h3`
  font-size: 2.2rem;
  font-weight: 500;
  color: #000;
  padding-left: 5px;
`
export const InputContainer = styled.div`
  max-width: 900px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 10px;
`
export const SubInputContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`
export const VerticalInputContainer = styled.div`
  width: 100%;
  display: grid;
  gap: 10px;
`
export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  grid-gap: 5px;
`
export const SelectTitle = styled.div`
  font-size: 14px;
  margin-left: 5px;
`
export const Select = styled.select`
  min-width: 200px;
  max-width: 250px;
  height: 45px;
  border-radius: 5px;
  border: 1px solid #E6E6E6;
  outline: none;
  padding: 0 10px;
  font-size: 16px;
  transition: all .4 ease;
  color: #000;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: url(http://cdn1.iconfinder.com/data/icons/cc_mono_icon_set/blacks/16x16/br_down.png) no-repeat right transparent;
  background-position-x: 95%;
  background-size: 10px;

  &:hover {
    border: 1px solid ${azulCeu};
  }
`
export const Option = styled.option`

`
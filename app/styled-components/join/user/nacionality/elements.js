import styled from "styled-components";

const azulCeu = '#14A7D8'

export const Title = styled.h3`
  font-size: 2.2rem;
  font-weight: 500;
  color: #000;
  padding-left: 5px;
`
export const SubTitle = styled.p`
  font-size: 1.4rem;
  color: #000;
`
export const Container = styled.div`
  width: 250px;
  margin-top: 10px;
  height: 45px;
  display: flex;
  gap: 10px;
  padding: 0 10px;
  border: 1px solid ${p => p.focused ? azulCeu : '#E6E6E6'};
  border-radius: 5px;

  &:hover {
    border: 1px solid ${azulCeu};
  }
`
export const NacionalityFlag = styled.div`
  width: 30px;
  background-size: contain;
  background-position: 50%;
  background-repeat: no-repeat;
`
export const Select = styled.select`
  outline: none;
  border: none;
  flex-grow: 2;
  font-size: 1.6rem;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: url(http://cdn1.iconfinder.com/data/icons/cc_mono_icon_set/blacks/16x16/br_down.png) no-repeat right transparent;
  background-position-x: 95%;
  background-size: 10px;
`
export const Option = styled.option`

`
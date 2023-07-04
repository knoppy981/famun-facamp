import styled from "styled-components";

const azulCeu = '#14A7D8'

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
    gap: 10px;
	}
`
export const InputContainer = styled.div`
  display: grid;
  gap: 10px;
  margin-top: 10px;

  @media screen and (max-width: 500px) and (min-height: 700px) {
    min-width: auto;
	}
`
export const SubInputContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`
export const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  grid-gap: 5px;
`
export const SelectTitle = styled.div`
  font-size: 14px;
  margin-left: 5px;
`
export const Select = styled.select`
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
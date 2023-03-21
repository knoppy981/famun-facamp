import styled from "styled-components";

const azulCeu = '#14A7D8'

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  grid-gap: 5px;
`
export const Label = styled.label`
  font-size: 1.4rem;
  margin-left: 5px;
  color: ${props => props.err ? '#d61f0a' : '#000'};

  @media screen and (max-width: 300px) {
    font-size: 10px;
  }
`
export const AdvisorRoleSelect = styled.select`
  height: 4rem;
  outline: none;
  border: none;
  font-size: 1.4rem;
  padding: 0 30px 0 15px;
  border-radius: 5px;
  border: 1px solid ${p => p.err ? '#d61f0a' : '#E6E6E6'};
  flex-grow: 2;
  font-size: 1.4rem;
  color: #000;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: url(http://cdn1.iconfinder.com/data/icons/cc_mono_icon_set/blacks/16x16/br_down.png) no-repeat right transparent;
  background-position-x: 95%;
  background-size: 10px;

  &:focus, &:hover {
    border: 1px solid ${p => p.err ? '#d61f0a' : azulCeu};
  }

  &:disabled {
    border: 1px solid transparent;
    background: transparent;
    opacity: 1;
  }
`
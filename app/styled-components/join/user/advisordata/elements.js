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
export const Label = styled.div`
  font-size: 1.4rem;
  margin-left: 5px;
  color: ${props => props.err ? '#d61f0a' : '#000'};

  @media screen and (max-width: 500px) and (min-height: 700px) {
    font-size: 1.6rem;
	}
`
export const SelectBox = styled.div`
  height: auto;
  display: flex;
  gap: 5px;
  align-items: center;

  @media screen and (max-width: 500px) {
    display: grid;  
    gap: 5px;
	}
`
export const SelectBoxAuxDiv = styled.div`
  height: auto;
  display: flex;
  gap: 20px;
  align-items: center;

  @media screen and (max-width: 500px) {
    border-radius: 5px;
    border: 1px solid ${p => p.err ? '#d61f0a' : '#E6E6E6'};
    padding: 0 15px;
    gap: 15px;
    margin-bottom: 15px;
	}
`
export const Select = styled.select`
  width: 120px;
  height: 100%;
  outline: none;
  border-radius: 5px;
  padding: 5px;
  font-size: 1.4rem;

  -webkit-appearance: none;
  -moz-appearance: none;
  background: url(http://cdn1.iconfinder.com/data/icons/cc_mono_icon_set/blacks/16x16/br_down.png) no-repeat right transparent;
  background-position-x: 95%;
  background-size: 10px;

  @media screen and (max-width: 500px) and (min-height: 700px) {
    font-size: 1.8rem;
	}
`
export const Option = styled.option`
`
export const Input = styled.input`
  width: 100%;
  height: 4.5rem;
  border-bottom: 1px solid ${p => p.err ? '#d61f0a' : '#E6E6E6'};
  outline: none;
  padding: 0 10px; 
  font-size: 1.6rem;
  transition: all .4 ease;
  color: #000;
  background: transparent;
  -webkit-text-fill-color: #000 !important;

  &:focus, &:hover {
    border-bottom: 1px solid ${p => p.err ? '#d61f0a' : azulCeu};

    @media screen and (max-width: 500px) and (min-height: 700px) {
      border: none;
	  }
  }
  &::placeholder {
    opacity: .6;
    font-style: italic;
  }

  @media screen and (max-width: 500px) and (min-height: 700px) {
    height: 5.2rem;
    font-size: 1.8rem;
    border: none;
    padding: 0; 
	}
`
export const Button = styled.button`
  height: 100%;
  width: 80px;
  background: transparent;
  border-radius: 5px;
	font-size: 1.4rem;
  transition: .4s all ease;
  margin-left: auto;
  margin-right: 0;

  &:disabled {
    color: #666666;
  }

  @media screen and (max-width: 500px) and (min-height: 700px) {
    height: 5.2rem;
    font-size: 1.4rem;
	}
`
export const List = styled.ul`
`
export const SocialMedias = styled.li`
  height: 30px;
  display: flex;
  gap: 30px;
  align-items: center;

  div {
    opacity: ${p => p.active ? "1" : ".5"};
  }
`
export const SMName = styled.div`
  width: 120px;
  font-size: 1.4rem;
  padding-left: 10px;
`
export const SMValue = styled.div`
  max-width: 200px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  background: transparent;
  font-size: 1.4rem;
  flex-grow: 1;
  padding: 0 5px;
`
export const SMDeleteButton = styled.button`
  width: 80px;
  display: flex;
  justify-content: center;
  border: none;
  outline: none;
  margin-right: 0;
  margin-left: auto;
  color: #777777;
  transition: all .4s ease;
  cursor: pointer;

  &:hover {
    color: #d61f0a;
  }
  
  svg{
    height: 20px;
    width: 20px;
  }
`
export const AdvisorRoleSelect = styled.select`
  height: 3rem;
  outline: none;
  border: none;
  font-size: 1.4rem;
  padding: 0 30px 0 5px;
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
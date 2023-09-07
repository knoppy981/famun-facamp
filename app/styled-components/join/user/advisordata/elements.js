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
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
  padding: ${p => p.padding ? "20px 20px 10px" : "20px"};
  border: 1px solid #e6e6e6;
  border-radius: 10px;
  height: auto;
  margin-bottom: auto;
  margin-top: 10px;
`
export const Label = styled.div`
  font-size: 1.4rem;
  font-weight: 600;
`
export const SelectBox = styled.div`
  height: 30px;
  display: flex;
  gap: 30px;
  align-items: center;
`
export const Select = styled.select`
  width: 120px;
  height: 100%;
  outline: none;
  border-radius: 5px;
  padding: 5px;
  font-size: 1.4rem;
`
export const Option = styled.option`
`
export const Input = styled.input`
  height: 100%;
  flex-grow: 1;
  background: transparent;
  outline: none;
  border: none;
  font-size: 1.4rem;
  transition: all .4 ease;
  color: #000;
  border-bottom: 1px solid #A7A7A7;
  padding: 0 5px;
  -webkit-text-fill-color: #000 !important;

  &::placeholder {
    opacity: .6;
    font-style: italic;
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
`
export const List = styled.ul`
`
export const SocialMedias = styled.li`
  height: 30px;
  display: flex;
  gap: 30px;
  align-items: center;
  cursor: pointer;

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

  &:hover {
    color: #d61f0a;
  }
  
  svg{
    height: 20px;
    width: 20px;
  }
`
export const AdvidorRoleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  border: 1px solid #e6e6e6;
  border-radius: 10px;
  height: auto;
  margin-bottom: auto;
  margin-top: 10px;
`
export const AdvisorRoleSelect = styled.select`
  width: 100%;
  height: 100%;
  outline: none;
  border-radius: 5px;
  padding: 5px;
  font-size: 1.4rem;
  cursor: pointer;
`
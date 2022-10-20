import styled from "styled-components"

export const Wrapper = styled.div`
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: column;
  grid-gap: 40px;
  padding-top: 100px;
`
export const TitleBox = styled.div`
  display: grid;
`
export const Title = styled.div`
  font-size: 35px;
  font-weight: 500;
  color: #183567;
`
export const SubTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #666666;
`
export const Container = styled.div`
  height: 400px;
  display: grid;
  grid-template-columns: 1.2fr 3fr;
  grid-gap: 25px;
`
export const ItemList = styled.ul`
  width: 100%;
  height: 100%;
  box-shadow: 0px 2px 18px 0px rgba(0,0,0,.3);
  display: flex;
  flex-direction: column;
  grid-gap: 15px;
  padding: 40px;
`
export const ItemWrapper = styled.div`
  width: 100%;
  height: 100%;
  box-shadow: 0px 2px 18px 0px rgba(0,0,0,.3);
`
export const ItemContainer = styled.div`
  position: relative;
  height: calc(100% - 80px);
  display: flex;
  flex-direction: column;
  grid-gap: 25px;
  margin: 40px;
`
export const ContainerTitle = styled.div`
  font-size: 25px;
  font-weight: 500;
  color: #183567;
`
export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  grid-gap: 25px;
`
export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  grid-gap: 25px;
`
export const PasswordBox = styled.div`
  width: 300px;
  height: 80px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 40px 16px;
`
export const PasswordTitle = styled.div`
	opacity: .6;
  font-size: 14px;
`
export const Password = styled.div`
  grid-row-start: 2;
	font-size: 15px;
	font-weight: 500;
	opacity: .6;
`
export const PasswordEditButton = styled.button`
  grid-row-start: 2;
	border: none;
	outline: none;
	cursor: pointer;
  display: flex;
  gap: 5px;
	opacity: .6;
  transition: opacity .4s ease;

  &:hover {
  	opacity: 1;
  }
  p {
    font-size: 14px;
  }
  svg {
    height: 20px;
    width: 20px;
  }
`
export const SaveChangesButton = styled.button`
  position: absolute;
  bottom: 0;
  right: 0;
  height: 50px;
  width: 200px;
  background: #183567;
  color: #fff;
  opacity: 1;
  transition: background .4s ease;

  &:disabled {
    opacity: .6; 
    background: #000;
  }
`
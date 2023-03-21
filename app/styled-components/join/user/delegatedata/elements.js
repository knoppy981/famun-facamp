import styled from "styled-components";

const azulClaro = '#BDE8F5'

export const TitleBox = styled.div`
  height: 40px;
  display: flex;
  justify-content: center;
`
export const Title = styled.h3`
  width: 426px;
  font-size: 2.2rem;
  font-weight: 500;
  color: #000;
`
export const Wrapper = styled.div`
  max-height: calc(70vh - 245px);
  margin-top: 20px;
  display: grid;
  gap: 30px;
  padding: 5px;
  padding-right: 10px;
  overflow-y: scroll;
  overflow-x: hidden;

  background: /* Shadow covers */
  linear-gradient(white 30%, rgba(255, 255, 255, 0)), linear-gradient(rgba(255, 255, 255, 0), white 70%) 0 100%, /* Shadows */
  radial-gradient(farthest-side at 50% 0, rgba(0, 0, 0, .2), rgba(0, 0, 0, 0)), radial-gradient(farthest-side at 50% 100%, rgba(0, 0, 0, .2), rgba(0, 0, 0, 0)) 0 100%;
  background-repeat: no-repeat;
  background-color: white;
  background-size: 100% 40px, 100% 40px, 100% 14px, 100% 14px;
  /* Opera doesn't support this in the shorthand */
  background-attachment: local, local, scroll, scroll;
`
export const Container = styled.div`
  min-width: 426px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`
export const CheckBoxTitle = styled.div`
  max-width: 426px;
  font-size: 1.4rem;
  font-weight: 500;
  display: flex;
  gap: 5px;
  margin-left: 5px;
  color: ${props => props.err ? '#d61f0a' : '#000'};
  word-break: normal;

  svg {
    height: 15px;
    width: 15px;
    transform: translateY(2px);
  }
`
export const DragDropContainer = styled.div`
  display: flex;
  gap: 10px;
`
export const DragDropIndexes = styled.div`
  display: grid;

  div {
    display: grid;
    align-self: center;
    font-size: 1.4rem;
  }
`
export const ListItemContainer = styled.div`
  height: 45px;
  display: flex;
  align-items: center;
`
export const ListItem = styled.div`
  display: flex;
  align-items: center;
  height: 80%;
  background: #fff;
  border-radius: 5px;
  padding: 0 5px;
  background: ${p => p.first ? azulClaro : "#fff"};
  box-shadow: 0px 2px 5px -2px #000000;
  border: 1px solid ${p => p.first ? 'transparent' : '#E6E6E6'};
  transition: .3s all ease;
  font-size: 1.4rem;
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
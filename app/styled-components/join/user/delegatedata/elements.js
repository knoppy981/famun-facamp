import styled from "styled-components";

const azulClaro = '#BDE8F5'

export const TitleBox = styled.div`
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

  @media screen and (max-width: 500px) and (min-height: 700px) {
    max-height: 70vh; /* Fallback for browsers that do not support Custom Properties */
    max-height: calc((var(--full-height, 1vh) * 80) - 244px);;
    gap: 20px;
	}
`
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media screen and (max-width: 500px) {
    max-width: calc((var(--full-width, 1vh) * 94) - 15px);
	}

  @media screen and (max-width: 500px) and (min-height: 700px) {
    min-width: auto;
	}
`
export const CheckBoxTitle = styled.div`
  max-width: 426px;
  font-size: 1.4rem;
  gap: 5px;
  margin-left: 5px;
  color: ${props => props.err ? '#d61f0a' : '#000'};
  word-break: normal;

  b {
    font-size: inherit;
  }

  svg {
    height: 15px;
    width: 15px;
    transform: translateY(2px);
  }

  @media screen and (max-width: 500px) {
    max-width: calc((var(--full-width, 1vh) * 100) - 55px);
    font-size: 1.6rem;
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

  @media screen and (max-width: 500px) and (min-height: 700px) {
    height: 5.2rem;
	}
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

  @media screen and (max-width: 500px) and (min-height: 700px) {
    font-size: 1.6rem;
	}
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
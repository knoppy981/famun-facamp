import styled from "styled-components";

const azulCeu = '#14A7D8'

export const TitleBox = styled.div`
  height: 40px;
  display: flex;
  justify-content: center;
`
export const Title = styled.h3`
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
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`
export const Label = styled.div`
  font-size: 1.4rem;
  font-weight: 500;
  display: flex;
  gap: 5px;
  margin-left: 5px;
`
export const SelectBox = styled.div`
  height: 3rem;
  display: flex;
  gap: 30px;
  align-items: center;
`
export const Select = styled.select`
  width: 120px;
  height: 100%;
  outline: none;
  border: 1px solid #e6e6e6;
  border-radius: 5px;
  padding: 5px;
  font-size: 1.4rem;

  -webkit-appearance: none;
  -moz-appearance: none;
  background: url(http://cdn1.iconfinder.com/data/icons/cc_mono_icon_set/blacks/16x16/br_down.png) no-repeat right transparent;
  background-position-x: 95%;
  background-size: 10px;
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
  border: 1px solid #e6e6e6;
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
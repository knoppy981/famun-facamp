import styled from "styled-components"

const azulClaro = '#BDE8F5'

const ButtonWrapper = styled.div`
  border-radius: 5px;
  height: 4.5rem;
  background: ${p => p.whiteBackground || p.isDisabled ? "transparent" : azulClaro};
  gap: 15px;
  border-radius: 5px;
  box-shadow: 0px 2px 5px -2px #000000;
	cursor: pointer;
  transition: 0.4s all ease;
  color: ${p => p.isDisabled ? '#666666' : '#000'};
  font-weight: 400;
	font-size: 1.5rem;

  > * {
    width: 100%;
    height: 100%;
  }

  @media screen and (max-width: 500px) and (min-height: 700px) {
    height: 5.2rem;
    font-size: 1.8rem;
	}
`

const DefaultButtonBox = ({ children, ...props }) => {
  return (
    <ButtonWrapper {...props}>
      {children}
    </ButtonWrapper>
  )
}

export default DefaultButtonBox
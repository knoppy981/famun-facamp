import styled from 'styled-components'

export const Wrapper = styled.div`
	height: calc(100vh - 84px);
	width: 100%;
	background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
`
export const Container = styled.div`
  display: flex;
  width: 80%;
  height: 100%;
  flex-direction: column;
  grid-gap: 15px;
  padding: 100px 0;
`
export const Title = styled.div`
  font-size: 35px;
  font-weight: 500;
  color: #183567;
`
export const Subtitle = styled.div`
  font-size: 16px;
  color: #666666;

  h2 {
    font-size: 20px;

  }
`
export const ButtonContainer = styled.div`
  margin-top: 60px;
  display: grid;
  grid-gap: 25px;
  margin-top: auto;
  margin-bottom: 0%;
`
export const Button = styled.button`
  background: #183567;
	border-radius: 5px;
	width: 400px;
  height: 60px;
	cursor: pointer;
  transition: 0.4s all ease;

  p {
    font-weight: 500;
	  color: #fff;
  }
`
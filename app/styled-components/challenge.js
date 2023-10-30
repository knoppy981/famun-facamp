import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`
export const GoBackLinkWrapper = styled.div`
  position: absolute;
  left: 5%;
  top: 5%;
  height: 40px;
  font-size: 1.6rem;
`
export const Container = styled.div`
  min-height: 70svh;
  margin: 15vh 0;
 	width: 400px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  
  @media screen and (max-width: 700px) {
    gap: 20px;
    margin: 100px 0 50px;
    width: 100vw;
    padding: 0 15px;
	}
`
export const Title = styled.div`
  font-size: 3.6rem;
  font-weight: 900;
  color: #183567;
  margin-right: 5px;
  display: flex;
  justify-content: center;

  @media screen and (max-width: 800px) {
    font-size: 4.2rem;
  }

  @media screen and (max-width: 500px) {
    font-size: 4.8rem;
  }

  @media screen and (max-width: 350px) {
    font-size: 3rem;
  }
`
export const Subtitle = styled.h3`
  font-size: 2.6rem;
  font-weight: 500;
  color: #000;
`
export const FormContainer = styled.div`
	width: 100%;
  color: #fff;
  display: flex;
  flex-direction: column;
	grid-gap: 25px;

  p {
    font-size: 1.4rem;
    color: #000;

    a {
      margin-left: 8px;
      display: inline-block;
      color: #0a66c2;
    }
  }

  b {
    font-size: 1.4rem;
    font-weight: 600;
    color: #000;
  }
`
export const ButtonContainer = styled.div`
  align-self: center;
  width: 200px;
	margin-top: 30px;

  @media screen and (max-width: 700px) {
    margin-top: 60px;
	}
`
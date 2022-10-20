import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  justify-items: center;
  align-items: center;
  margin: 80px;
  color: #fff;
  grid-gap: 40px;
`
export const Image = styled.img`
  width: 70%;
  height: auto;
`
export const Container = styled.div`
  width: 100%;
  display: grid;
  grid-gap: 80px;
  align-self: start;
  `
export const Title = styled.div`
  width: 100%;
  font-size: 40px;
  font-weight: 500;
`
export const Info = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  grid-gap: 15px;
`
export const InfoTitle = styled.div`
  font-size: 24px;
  color: #E2D650;
  margin-bottom: 20px;
`
export const Button = styled.button`
  height: 60px;
  width: 100%;
  border: ${({complete}) => complete ? "2px solid #1AC507" : "2px solid rgba(226, 214, 80, .4)"};
  color: ${({complete}) => complete ? "#1AC507" : "#fff"};
  border-radius: 5px;
  padding: 15px;
  transition :0.4s all ease;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover {
    color: ${({complete}) => complete ? "" : "#E2D650"};
    border: ${({complete}) => complete ? "" : "2px solid #E2D650"};
  }

  svg{
    height: 30px;
    width: auto;
  }
`

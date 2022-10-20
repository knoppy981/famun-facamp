import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  flex-direction: column;
  margin: 80px;
  color: #fff;
  grid-gap: ${ props => props.gap ? props.gap : "100px"};
`
export const Title = styled.div`
  width: 100%;
  font-size: 40px;
  font-weight: 500;
`
export const Container = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-items: center;
`
export const Image = styled.img`
  width: ${props => props.width ? props.width : '80%'};
  height: auto;
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
`
export const InfoSubtitle = styled.div`
  font-size: 16px;
`
export const ButtonsContainer = styled.div`
  margin-top: 45px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 45px;
`
export const Button = styled.button`
  height: 80px;
  width: 100%;
  border: 2px solid rgba(226, 214, 80, .4);
  border-radius: 5px;
  padding: 15px;
  transition :0.4s all ease;

  &:hover {
    color: #E2D650;
    border: 2px solid #E2D650;
  }
`

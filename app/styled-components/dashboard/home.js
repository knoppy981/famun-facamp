import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;

  @media screen and (max-width: 700px) {
    padding: 0 15px;
  }
`
export const Title = styled.div`
  height: 3rem;
  font-size: 1.8rem;
  font-weight: 500;
  color: #000;
  display: flex;
  align-items: center;
  gap: 10px;
`
export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 30px;

  @media screen and (max-width: 700px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;

    a {
      width: 100%;

      & > div {
        flex-grow: 2;
      }
    }
  }
`
export const Item = styled.div`
  min-width: 200px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  border-radius: 10px;
  padding: 15px 25px;
  box-shadow: 0px 1px 5px -2px #000000;
  font-size: 1.5rem;
`
export const ItemTitle = styled.div`
  font-size: 1.6rem;
  font-weight: 500;
  color: #000;
  display: flex;
  align-items: center;
  gap: 10px;
`

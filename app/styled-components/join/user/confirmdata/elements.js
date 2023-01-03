import styled from "styled-components";

export const Title = styled.h3`
  font-size: 2.2rem;
  font-weight: 500;
  color: #000;
  padding-left: 5px;
`
export const SubTitle = styled.p`
  font-size: 1.4rem;
  color: #000;
`
export const List = styled.div`
  display: flex;
  max-width: 1000px;
  gap: 80px;
  margin-top: 15px;
  padding-left: 10px;
`
export const Column = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 250px;
  overflow-x: hidden;
`
export const Item = styled.li`
  font-size: 1.5rem;
  
  p {
    font-size: inherit;
  }
`
export const Label = styled.div`
  font-size: 1.2rem;
  color: #666666;
`
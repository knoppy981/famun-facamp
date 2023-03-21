import styled from "styled-components";

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
export const SubTitle = styled.p`
  width: 426px;
  font-size: 1.4rem;
  color: #000;
`
export const List = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  max-width: 700px;
  gap:  10px 40px;
  margin-top: 30px;

  @media screen and (max-width: 1000px) {
    grid-template-columns: repeat(2, 1fr);
	}
`
export const Column = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 300px;
  overflow-x: hidden;
`
export const Item = styled.li`
  font-size: 1.5rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  
  p {
    font-size: inherit;
  }
`
export const Label = styled.div`
  font-size: 1.2rem;
  color: #666666;
`
import styled from "styled-components";

export const Title = styled.h3`
  font-size: 2.2rem;
  font-weight: 500;
  color: #000;
  margin-left: 5px;
`
export const SubTitle = styled.p`
  font-size: 1.4rem;
  color: #000;
  margin-left: 5px;
`
export const List = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-top: 20px;
  gap: 10px 40px;

  @media screen and (max-width: 700px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin: 20px 15px 0;
	}
`
export const Item = styled.div`
  font-size: 1.5rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  ${({isSpanTwoColumns}) => isSpanTwoColumns && `
    grid-column: span 2;
  `}
`
export const Label = styled.div`
  font-size: 1.2rem;
  color: #666666;

  @media screen and (max-width: 700px) {
    font-size: 1.5rem;
	}
`
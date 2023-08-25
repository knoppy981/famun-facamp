import styled from "styled-components";

export const TitleBox = styled.div`
  display: flex;
  justify-content: center;
  margin-left: 5px;
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
  grid-template-columns: 1fr 1fr;
  margin-top: 20px;
  gap: 10px 40px;

  @media screen and (max-width: 500px) and (min-height: 700px) {
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
`
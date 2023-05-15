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
  grid-template-columns: 1fr 1fr;
  margin-top: 20px;
  max-height: calc(70vh - 271px);
  gap: 10px 40px;
  overflow-y: scroll;
  overflow-x: hidden;

  background: /* Shadow covers */
  linear-gradient(white 30%, rgba(255, 255, 255, 0)), linear-gradient(rgba(255, 255, 255, 0), white 70%) 0 100%, /* Shadows */
  radial-gradient(farthest-side at 50% 0, rgba(0, 0, 0, .2), rgba(0, 0, 0, 0)), radial-gradient(farthest-side at 50% 100%, rgba(0, 0, 0, .2), rgba(0, 0, 0, 0)) 0 100%;
  background-repeat: no-repeat;
  background-color: white;
  background-size: 100% 40px, 100% 40px, 100% 14px, 100% 14px;
  /* Opera doesn't support this in the shorthand */
  background-attachment: local, local, scroll, scroll;

  @media screen and (max-width: 500px) and (min-height: 700px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin: 20px 15px 0;
	}
`
export const Item = styled.div`
  font-size: 1.5rem;
  max-width: 150px;
`
export const Label = styled.div`
  font-size: 1.2rem;
  color: #666666;
`
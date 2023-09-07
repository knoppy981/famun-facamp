import styled from "styled-components";

const azulCeu = '#14A7D8'

export const Title = styled.h3`
  font-size: 2.2rem;
  font-weight: 500;
  color: #000;
  margin-left: 5px;
`
export const TextContainer = styled.div`
  max-height: 300px;
  margin: 10px 0 20px;
  padding: 10px;
  padding-right: 10px;
  border: 1px solid #E6E6E6;
  border-radius: 5px;
  font-size: 1.4rem;

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
    gap: 20px;
	}
`

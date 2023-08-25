import styled from "styled-components";

export const Wrapper = styled.div`
  font-size: inherit;
`
export const Container = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  font-size: inherit;
`
export const DataSegment = styled.div`
  border: none;
  outline: none;
  display: grid;
  place-content: center;
  font-size: inherit;

  ${({isPlaceholder}) => ("")}

  &:focus {
    text-decoration: underline;
  }
`
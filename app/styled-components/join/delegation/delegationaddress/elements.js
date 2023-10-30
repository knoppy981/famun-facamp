import styled from "styled-components";

const azulCeu = '#14A7D8'

export const Title = styled.h3`
  font-size: 2.2rem;
  font-weight: 500;
  color: #000;
  margin-left: 5px;
`
export const Wrapper = styled.div`
  margin-top: 20px;
  display: grid;
  gap: 30px;
  padding: 5px;
  padding-right: 10px;

  @media screen and (max-width: 700px) {
    gap: 10px;
	}
`
export const InputContainer = styled.div`
  display: grid;
  gap: 10px;
  margin-top: 10px;

  @media screen and (max-width: 700px) {
    min-width: auto;
	}
`
export const SubInputContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`
export const NacionalityFlag = styled.div`
  width: 30px;
  background-size: contain;
  background-position: 50%;
  background-repeat: no-repeat;
`
import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  flex-direction: column;
  margin: 80px;
  color: #fff;
  grid-gap: 15px;
`
export const Title = styled.div`
  width: 100%;
  font-size: 40px;
  font-weight: 500;
  border-bottom: 3px solid #E2D650;
`
export const Subtitle = styled.div`
  width: 100%;
  margin-left: 40px;
`
export const GridWrapper = styled.div`
  width: 100%;
  margin: 60px 0 0 0;
`
export const GridTitle = styled.div`
  margin-bottom: 15px;
`
export const DelegatesGrid = styled.div`
  width: 100%;
  display: grid;
  grid-gap: 25px;
  grid-template-columns: repeat(3, 1fr);
  max-height: 390px;
  overflow-y: auto;
  overflow-x: hidden;

  /* &::-webkit-scrollbar {
    -webkit-appearance: none;
  }
  &::-webkit-scrollbar:vertical {
    width: 8px;
  }
  &::-webkit-scrollbar:horizontal {
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 7px;
    border: none; should match background, can't be transparent
    background-color: rgba(0, 0, 0, .2);
  } */
`
export const Delegate = styled.div`
  height: 160px;
  border-radius: 5px 5px 0 0;
  display: flex;
  padding: 20px;
  border: 2px solid rgba(226, 214, 80, .4);
  border-bottom: 3px solid ${props => props.role === "Professor" ? "red" : props.role === "Chefe" ? "#fff" : "#E2D650"};
`
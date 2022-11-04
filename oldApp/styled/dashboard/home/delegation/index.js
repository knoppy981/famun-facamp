import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  flex-direction: column;
  margin: 80px;
  color: #fff;
`
export const Title = styled.div`
  width: 100%;
  font-size: 40px;
  font-weight: 500;
`
export const Subtitle = styled.div`
  width: 100%;
  font-size: 32px;
  opacity: .8;
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
  max-height: 390px;
  overflow-y: auto;
  overflow-x: hidden;
  border-bottom: 2px solid rgba(226, 214, 80, .4);
`
export const Delegate = styled.div`
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  border: 2px solid rgba(226, 214, 80, .4);
  border-bottom: none;
  /* border-left: 2px solid ${props => props.role === "Professor" ? "red" : props.role === "Chefe" ? "#fff" : "#E2D650"} */
`
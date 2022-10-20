import styled from 'styled-components'

export const Container = styled.div`
  position: absolute;
  top: 10vh;
  right: 30px;
  width: 300px;
  background:  #242526;
  border: 1px solid #000;
  color: #fff;
  border-radius: 5px;
  padding: 15px 0;
  overflow: hidden;
  transition: all 500ms ease;
  display: flex;
  flex-direction: column;
`

export const Item = styled.a`
  max-height: 40px;
  display: flex;
  align-items: center;
  transition: all 500ms ease;
  padding: 15px;
  text-decoration: none;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #525357;
  }
`
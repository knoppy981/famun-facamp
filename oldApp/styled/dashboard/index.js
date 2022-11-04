import styled from "styled-components";
import { Link, Form } from '@remix-run/react'
import { BsCheckAll } from 'react-icons/bs'

export const Wrapper = styled.div`
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: column;
  grid-gap: 40px;
  padding-top: 100px;
`
export const ProfileBox = styled.div`
  display: grid;
`
export const UserName = styled.div`
  font-size: 35px;
  font-weight: 500;
  color: #183567;
`
export const UserSchool = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #666666;
`
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  grid-gap: 25px;
`
export const Title = styled.h3`
  color: #183567;
  font-size: 20px;
`
export const StepsContainer = styled.ul`
  display: grid;
  grid-gap: 25px;
  grid-template-columns: 1fr 1fr 1fr;
`
export const Step = styled.div`
  position: relative;
  font-size: 16px;
  font-weight: 500;
  color: #666666;
  height: 150px;
  display: flex;
  box-shadow: 0px 2px 18px 0px rgba(0,0,0,.3);
  padding: 20px 30px;
  transition: transform 300ms ease 0ms;
  cursor: pointer;

  ${({completed}) => {
    return completed ? 
      'border: 1px solid #1AC507; color: #1AC507;' : 
      null
  }}

  &:hover {
    transform: scale(1.05);
  }
`
export const StepTitle = styled.h2`
  text-transform: uppercase;
  font-size: 20px;
`
export const StepCompleteIcon = styled(BsCheckAll)`
  position: absolute;
  bottom: 20px;
  right: 30px;
  height: 30px;
  width: 30px;
`
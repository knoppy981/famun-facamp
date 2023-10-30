import { Form } from "@remix-run/react";
import styled from "styled-components";
import { motion } from "framer-motion";

export const DataForm = styled(Form)`
  @media screen and (max-width: 700px) {
    padding: 0 15px;
  }
`
export const DataTitleBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin: 15px 0;
  gap: 15px;
  padding-left: 5px;

  @media screen and (max-width: 700px) {
    gap: 5px;
  }
`
export const DataTitle = styled.div`
  font-size: 1.6rem;
  font-weight: 500;

  @media screen and (max-width: 700px) {
    font-size: 1.8rem;
  }
`
export const InputWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  box-sizing: border-box;
  min-width: 0;

  & > label {
    font-size: 1.4rem;
    white-space: nowrap;
    place-self: center start;

    @media screen and (max-width: 700px) {
      font-size: 1.6rem;
    }
  }
  & > div {
    height: 3rem;
    font-size: 1.4rem;
    border-radius: 5px;
    padding: 0 5px;
    @media screen and (max-width: 700px) {
      height: 4rem;
      font-size: 1.6rem;
	  }
  }
`
export const StickyButton = styled(motion.div)`
  position: sticky;
  bottom: 80px;
  margin: 0 0 0 auto;
  width: max-content;

  @media screen and (max-width: 700px) {
    bottom: 20px;
  }
`
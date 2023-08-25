import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion, useAnimation } from "framer-motion";

import * as S from "./elements"

const DefaultDropdown = ({ open, children }) => {

  const menu = {
    closed: {
      scale: 0,
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
    open: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.3,
        delayChildren: 0.3,
        staggerChildren: 0.05,
      },
    },
  }
  const arrow = {
    variants: {
      closed: { opacity: 0 },
      open: { opacity: 1 },
    },
    transition: { duration: 0.3 },
  }

  return (
    <AnimatePresence>
      {open &&
        <S.Container
          open={open}
          animate={open ? "open" : "closed"}
          initial="closed"
          exit="closed"
          variants={menu}
        >
          <S.Arrow {...arrow} />

          {children}
        </S.Container>
      }
    </AnimatePresence>
  )
}

export default DefaultDropdown
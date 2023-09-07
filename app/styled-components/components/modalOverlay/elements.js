import styled from "styled-components";

import { motion } from "framer-motion";

export const Background = styled(motion.div)`
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`
export const BlurBackground = styled(motion.div)`
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(5px);
`
export const Aside = styled(motion.aside)`
  position: fixed;
  z-index: 101;
  width: 65%;
  height: 100%;
  top: 0;
  right: 0;
  background: #FAFAFA;
`
import { useTooltipTriggerState } from 'react-stately';
import { mergeProps, useTooltip, useTooltipTrigger } from 'react-aria';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const color1 = "#192638"

export const Span = styled(motion.span)`
  position: absolute;
  z-index: 100;
  left: 5px;
  top: 100%;
  min-height: 3rem;
  max-width: 250px;
  display: flex;
  align-items: center;
  padding: 15px;
  border-radius: 1rem;
  gap: 5px;
  background: ${color1};
  color: #fff;
  font-size: 1.4rem;
  transform-origin: center 0;
  box-shadow: 0px 3px 5px -2px #000000;
  opacity: 1;

  @media screen and (max-width: 700px) {
    margin: 0 auto;
    width: 90vw;
    left: 50% !important;
    transform: translateX(-50%);
    display: flex;
  }
`

function Tooltip({ state, ...props }) {
  let { tooltipProps } = useTooltip(props, state);

  return (
    <Span {...mergeProps(props, tooltipProps)}>
      {props.children}
    </Span>
  );
}

export default Tooltip
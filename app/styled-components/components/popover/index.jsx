import { DismissButton, Overlay, useOverlayPosition, usePopover } from 'react-aria';
import { motion } from 'framer-motion';

import * as S from "./elements"

const menu = {
  closed: {
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
  open: {
    opacity: 1,
    transition: {
      duration: 0.3,
      staggerChildren: 0.05,
    },
  },
}

const menuItem = {
  variants: {
    closed: { scale: .9, opacity: 0 },
    open: { scale: 1, opacity: 1 },
  },
  transition: { opacity: { duration: 0.2 } },
}

const Popover = ({ isNonModal, children, state, ...props }) => {
  let { popoverProps, underlayProps, arrowProps, placement } = usePopover(props, state);

  return (
    <Overlay>
      {!isNonModal && (
        <div {...underlayProps} style={{ position: "fixed", inset: 0 }} />
      )}

      <S.Wrapper
        {...popoverProps}
        ref={props.popoverRef}
        open={state.isOpen}
        animate={state.isOpen ? "open" : "closed"}
        initial="closed"
        exit="closed"
        variants={menu}
      >
        <S.Arrow {...arrowProps} data-placement={placement}>
          <path d="M0 0,L6 6,L12 0" />
        </S.Arrow>

        {!isNonModal && <DismissButton onDismiss={state.close} />}
        <motion.div {...menuItem} style={{width: "100%"}}>
          {children}
        </motion.div>
        <DismissButton onDismiss={state.close} />
      </S.Wrapper>
    </Overlay>
  );
}

export default Popover
import React, { ReactNode } from 'react';
import { AriaModalOverlayProps, Overlay, useModalOverlay } from 'react-aria';
import { OverlayTriggerState } from 'react-stately';
import { motion } from 'framer-motion';

type ModalType = AriaModalOverlayProps & {
  children: ReactNode,
  state: OverlayTriggerState,
}

const variants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 }
};

const Modal = ({ state, children, ...props }: ModalType) => {
  let ref = React.useRef(null);
  let { modalProps, underlayProps } = useModalOverlay(props, state, ref);

  return (
    <Overlay>
      <motion.div
        {...underlayProps as any}
        className='modal-background'
        initial="hidden"
        animate={state.isOpen ? "visible" : "hidden"}
        exit="hidden"
        variants={variants}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className='modal-container'
          layout="preserve-aspect"
          layoutScroll
          key={"container"}
          {...modalProps as any}
          ref={ref}
        >
          {children}
        </motion.div>
      </motion.div>
    </Overlay>
  );
}

export default Modal
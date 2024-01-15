import React from 'react';
import { Overlay, useModalOverlay } from 'react-aria';
import { useOverlayTrigger } from 'react-aria';
import { useOverlayTriggerState } from 'react-stately';
import { AnimatePresence, motion } from 'framer-motion';

import Button from '~/components/button';

export const SidebarTrigger = ({ label, children, ...props }: any) => {
  let state = useOverlayTriggerState(props);
  let { triggerProps, overlayProps } = useOverlayTrigger(
    { type: 'dialog' },
    state
  );

  return (
    <>
      <Button {...triggerProps}>{label}</Button>

      <AnimatePresence>
        {state.isOpen &&
          (
            <Sidebar {...props} state={state} isDismissable={props.isDismissable}>
              {React.cloneElement(children(state.close), overlayProps)}
            </Sidebar>
          )}
      </AnimatePresence>
    </>
  );
}


export const Sidebar = ({ state, children, ...props }: any) => {
  let ref = React.useRef(null);
  let { modalProps, underlayProps } = useModalOverlay(props, state, ref);

  return (
    <Overlay>
      <motion.div
        {...underlayProps as any}
        className='modal-blur-background'
        animate={state.isOpen ? "open" : "closed"}
        initial="closed"
        exit="closed"
        variants={{
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
        }}
      >
        <motion.aside
          {...modalProps as any}
          className='sidebar-aside'
          ref={ref}
          variants={{
            closed: { x: '100%', opacity: 0 },
            open: { x: 0, opacity: 1 }
          }}
          transition={{ opacity: { duration: 0.2 } }}
        >
          {children}
        </motion.aside>
      </motion.div>
    </Overlay >
  );
}
import React from 'react';
import { DismissButton, Overlay, useOverlayPosition, usePopover } from 'react-aria';
import { motion } from 'framer-motion';

import type { AriaPopoverProps } from 'react-aria';
import type { OverlayTriggerState } from 'react-stately';
import { forwardRef } from 'react';
import { mergeRefs } from '~/lib/merge-refs';

interface PopoverProps extends Omit<AriaPopoverProps, 'popoverRef'> {
  children: React.ReactNode;
  state: OverlayTriggerState;
}

const variants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 }
};

const Popover = forwardRef<HTMLDivElement, PopoverProps>((props, forwardedRef) => {
  const { isNonModal, children, state, offset, ...rest } =
    props
  const popoverRef = React.useRef(null);
  let { popoverProps, underlayProps, arrowProps, placement } =
    usePopover({ ...props, offset, popoverRef }, state);

  return (
    <Overlay>
      {!isNonModal && (
        <div {...underlayProps} style={{ position: "fixed", inset: 0 }} />
      )}

      <motion.div
        {...popoverProps as any}
        ref={mergeRefs([popoverRef, forwardedRef])}
        className="popover"
        initial="hidden"
        animate={state.isOpen ? "visible" : "hidden"}
        exit="hidden"
        variants={variants}
        transition={{ duration: 0.2 }}
      >
        <svg
          {...arrowProps}
          className="popover-arrow"
          data-placement={placement}
          viewBox="0 0 12 12"
        >
          <path d="M0 0,L6 6,L12 0" />
        </svg>

        {!isNonModal && <DismissButton onDismiss={state.close} />}

        {/* <motion.div {...menuItem} style={{ width: "100%" }}>
          {children}
        </motion.div> */}
        {children}
        <DismissButton onDismiss={state.close} />
      </motion.div>
    </Overlay>
  );
})

export default Popover
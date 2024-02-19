import React from 'react';
import { useOverlayTrigger } from 'react-aria';
import { useOverlayTriggerState } from 'react-stately';
import Popover from './index';
import { AnimatePresence } from 'framer-motion';
import Button from '../button';

const PopoverTrigger = ({ isNonModal, label, children, buttonClassName, ...props }: any) => {
  let ref = React.useRef(null);
  let popoverRef = React.useRef(null);

  let state = useOverlayTriggerState(props);
  let { triggerProps, overlayProps } = useOverlayTrigger(
    { type: 'dialog' },
    state,
    ref
  );

  return (
    <>
      <Button {...triggerProps} ref={ref} className={buttonClassName}>{label}</Button>
      
      <AnimatePresence>
        {state.isOpen &&
          (
            <Popover
              {...props}
              triggerRef={ref}
              ref={popoverRef}
              state={state}
              placement="bottom"
              offset={10}
              isNonModal={isNonModal}
            >
              {React.cloneElement(children, { open: state.isOpen, ...overlayProps })}
            </Popover>
          )}
      </AnimatePresence>
    </>
  );
}

export default PopoverTrigger
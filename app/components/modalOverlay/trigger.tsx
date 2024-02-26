import React from 'react';
import { useOverlayTrigger } from 'react-aria';
import { useOverlayTriggerState } from 'react-stately';
import Modal from '.';

import Button from '../button';
import { AnimatePresence } from 'framer-motion';

function ModalTrigger({ label, children, buttonClassName, ...props }: any) {
  let state = useOverlayTriggerState(props);
  let { triggerProps, overlayProps } = useOverlayTrigger(
    { type: 'dialog' },
    state
  );

  return (
    <>
      <Button {...triggerProps} className={buttonClassName} >{label}</Button>

      <AnimatePresence>
        {state.isOpen && 
          <Modal {...props} state={state} isDismissable={props.isDismissable}>
            {React.cloneElement(children(state.close), overlayProps)}
          </Modal>
        }
      </AnimatePresence>
    </>
  );
}

export default ModalTrigger
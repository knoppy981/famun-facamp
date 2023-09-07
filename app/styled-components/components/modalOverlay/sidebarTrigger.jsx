import { useOverlayTrigger } from 'react-aria';
import { useOverlayTriggerState } from 'react-stately';
import { AnimatePresence } from 'framer-motion';

import Button from '~/styled-components/components/button';
import Sidebar from './sidebar';

const SidebarTrigger = ({ label, children, ...props }) => {
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

export default SidebarTrigger
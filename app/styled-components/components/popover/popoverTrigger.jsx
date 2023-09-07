import { useOverlayTrigger } from 'react-aria';
import { useOverlayTriggerState } from 'react-stately';
import Button from '~/styled-components/components/button';
import Popover from './index';
import { AnimatePresence } from 'framer-motion';

const PopoverTrigger = ({ isNonModal, label, children, ...props }) => {
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
      <Button {...triggerProps} buttonRef={ref}>{label}</Button>
      <AnimatePresence>
        {state.isOpen &&
          (
            <Popover
              {...props}
              triggerRef={ref}
              popoverRef={popoverRef}
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
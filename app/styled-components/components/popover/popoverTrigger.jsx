import { useOverlayTrigger } from 'react-aria';
import { useOverlayTriggerState } from 'react-stately';
import Button from '~/styled-components/components/button';
import Popover from './index';

const PopoverTrigger = ({ label, children, ...props }) => {
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
      {true &&
        (
          <Popover
            {...props}
            triggerRef={ref} 
            popoverRef={popoverRef}
            state={true}
            placement="bottom"
            offset={10}
          >
            {React.cloneElement(children, overlayProps)}
          </Popover>
        )}
    </>
  );
}

export default PopoverTrigger
import { useOverlayTrigger } from 'react-aria';
import { useOverlayTriggerState } from 'react-stately';
import Button from '~/styled-components/components/button';
import Modal from '.';

function ModalTrigger({ label, children, ...props }) {
  let state = useOverlayTriggerState(props);
  let { triggerProps, overlayProps } = useOverlayTrigger(
    { type: 'dialog' },
    state
  );

  return (
    <>
      <Button {...triggerProps}>{label}</Button>
      {state.isOpen &&
        (
          <Modal {...props} state={state} isDismissable={props.isDismissable}>
            {React.cloneElement(children(state.close), overlayProps)}
          </Modal>
        )}
    </>
  );
}

export default ModalTrigger
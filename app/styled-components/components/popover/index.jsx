import { DismissButton, Overlay, useOverlayPosition, usePopover } from 'react-aria';

import * as S from "./elements"

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
      >
        <S.Arrow {...arrowProps} data-placement={placement}>
          <path d="M0 0,L6 6,L12 0" />
        </S.Arrow>

        {!isNonModal && <DismissButton onDismiss={state.close} />}
        {children}
        <DismissButton onDismiss={state.close} />
      </S.Wrapper>
    </Overlay>
  );
}

export default Popover
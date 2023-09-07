import { Overlay, useModalOverlay } from 'react-aria';

import * as S from './elements'

const Modal = ({ state, children, ...props }) => {
  let ref = React.useRef(null);
  let { modalProps, underlayProps } = useModalOverlay(props, state, ref);

  return (
    <Overlay>
      <S.Background {...underlayProps}>
        <div
          {...modalProps}
          ref={ref}
        >
          {children}
        </div>
      </S.Background>
    </Overlay>
  );
}

export default Modal
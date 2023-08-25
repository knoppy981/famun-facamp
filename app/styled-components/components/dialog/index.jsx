import { useDialog } from 'react-aria';

import * as S from "./elements"

const Dialog = ({ title, children, ...props }) => {
  let ref = React.useRef(null);
  let { dialogProps, titleProps } = useDialog(props, ref);

  return (
    <S.Container {...dialogProps} ref={ref}>
      {title &&
        (
          <h3 {...titleProps} style={{ marginTop: 0 }}>
            {title}
          </h3>
        )}
      {children}
    </S.Container>
  );
}

export default Dialog
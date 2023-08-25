import { useToggleState } from 'react-stately';
import { useCheckbox } from 'react-aria';

import * as S from "./elements"

const Checkbox = (props) => {
  let { children } = props;
  let state = useToggleState(props);
  let ref = React.useRef(null);
  let { inputProps } = useCheckbox(props, state, ref);

  return (
    <S.Label>
      <S.Input {...inputProps} ref={ref} />
      {children}
    </S.Label>
  );
}

export default Checkbox
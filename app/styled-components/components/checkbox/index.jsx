import { useToggleState } from 'react-stately';
import { useCheckbox } from 'react-aria';

import * as S from "./elements"

const Checkbox = (props) => {
  let { children } = props;
  let state = useToggleState(props);
  let ref = React.useRef(null);
  let { inputProps } = useCheckbox(props, state, ref);

  let isDisabled = state.isDisabled || props.isDisabled;
  let isSelected = state.isSelected && !props.isIndeterminate;

  return (
    <S.Label
      isDisabled={isDisabled}
      isSelected={isSelected}
    >
      <S.Input {...inputProps} ref={ref} />

      <span>
        {children}
      </span>
    </S.Label>
  );
}

export default Checkbox
import React from 'react';
import { useToggleState } from 'react-stately';
import { AriaCheckboxProps, useCheckbox } from 'react-aria';

type CheckboxProps = {
  className?: string
} & AriaCheckboxProps;

const Checkbox = (props: CheckboxProps) => {
  let { children } = props;
  let state = useToggleState(props);
  let ref = React.useRef(null);
  let { inputProps } = useCheckbox(props, state, ref);

  let isDisabled = props.isDisabled;
  let isSelected = state.isSelected && !props.isIndeterminate;

  return (
    <div className={props.className ?? 'primary-input-box'}>
      <label className={`checkbox-label ${isDisabled ? "disabled" : ""}`}>
        <input {...inputProps} ref={ref} className={`checkbox-input ${isDisabled ? "disabled" : ""}`} />

        {children}
      </label>
    </div>
  );
}

export default Checkbox
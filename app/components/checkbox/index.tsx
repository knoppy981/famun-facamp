import React, { forwardRef } from 'react';
import { useToggleState } from 'react-stately';
import { AriaCheckboxProps, useCheckbox } from 'react-aria';
import { mergeRefs } from '~/lib/merge-refs';

type CheckboxProps = {
  className?: string
} & AriaCheckboxProps;

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>((props, forwardedRef) => {
  let { children } = props;
  let state = useToggleState(props);
  let ref = React.useRef(null);
  let { inputProps } = useCheckbox(props, state, ref);

  let isDisabled = props.isDisabled;
  let isSelected = state.isSelected && !props.isIndeterminate;

  return (
    <div className={props.className ?? 'primary-input-box'}>
      <label className={`checkbox-label ${isDisabled ? "disabled" : ""}`}>
        <input {...inputProps} ref={mergeRefs([ref, forwardedRef])} className={`checkbox-input ${isDisabled ? "disabled" : ""}`} />

        {children}
      </label>
    </div>
  );
})

export default Checkbox
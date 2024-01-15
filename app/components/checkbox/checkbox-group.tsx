import React, { ReactNode } from 'react';
import { CheckboxGroupState, useCheckboxGroupState, } from 'react-stately';
import { AriaCheckboxGroupItemProps, AriaCheckboxGroupProps, useCheckboxGroup, useCheckboxGroupItem } from 'react-aria';
import { useError } from '~/hooks/useError';
/* import Tooltip from '../tooltip'; */

const CheckboxGroupContext = React.createContext<{
  state: CheckboxGroupState;
  error?: React.ReactNode;
} | null>(null);

export const Checkbox = (props: AriaCheckboxGroupItemProps) => {
  const { children } = props;
  const context = React.useContext(CheckboxGroupContext);
  if (context === null) return
  const { state, error } = context
  const ref = React.useRef(null);
  const { inputProps } = useCheckboxGroupItem(props, state, ref);

  const isDisabled = state.isDisabled || props.isDisabled;
  const isSelected = state.isSelected(props.value);

  return (
    <label
      className={`checkbox-label ${error ? "error" : ""} ${isDisabled ? "disabled" : ""}`}
    >
      <input {...inputProps} ref={ref} className={`checkbox-input ${error ? "error" : ""} ${isDisabled ? "disabled" : ""}`} />

      {children}
    </label>
  );
}

type CheckboxGroupProps = {
  children: ReactNode;
  action: any,
  className?: string
} & AriaCheckboxGroupProps;

export const CheckboxGroup = (props: CheckboxGroupProps) => {
  const ref = React.useRef(null)
  const { children, label, description } = props;
  const state = useCheckboxGroupState(props);
  const { groupProps, labelProps, descriptionProps, errorMessageProps } =
    useCheckboxGroup(props, state);
  const [error, handleInputErrorChange] = useError({
    errorMessage: props.errorMessage, action: props.action, onChangeUpdateError: state.value, ref: ref
  })

  return (
    <div {...groupProps} className={props.className ?? 'primary-input-box'} style={{ gap: 10 }} ref={ref}>
      {error ?
        <p {...errorMessageProps} className="label error">
          {error}
        </p>
        :
        <label {...labelProps} className="label">
          {label}
        </label>
      }

      <CheckboxGroupContext.Provider value={{ state, error }}>
        {children}
      </CheckboxGroupContext.Provider>

      {description && (
        <div {...descriptionProps} style={{ fontSize: 12 }}>{description}</div>
      )}
    </div>
  );
}
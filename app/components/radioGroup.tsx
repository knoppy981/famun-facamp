import React from 'react';
import { RadioGroupState, useRadioGroupState } from 'react-stately';
import { AriaRadioGroupProps, AriaRadioProps, useRadio, useRadioGroup } from 'react-aria';
import { useError } from '~/hooks/useError';

let RadioContext = React.createContext<{ state: RadioGroupState, error?: React.ReactNode } | null>(null);

type RadioGroupType = AriaRadioGroupProps & {
  children: React.ReactNode,
  action: any,
  className?: string
}

export function Radio(props: AriaRadioProps) {
  let { children } = props;
  const context = React.useContext(RadioContext);
  if (context === null) return
  const { state, error } = context
  let ref = React.useRef(null);
  let { inputProps } = useRadio(props, state, ref);

  const isDisabled = state.isDisabled || props.isDisabled;

  return (
    <label
      className={`checkbox-label ${error ? "error" : ""} ${isDisabled ? "disabled" : ""}`}
    >
      <input {...inputProps} ref={ref} className={`checkbox-input ${error ? "error" : ""} ${isDisabled ? "disabled" : ""}`} />

      {children}
    </label>
  );
}

export function RadioGroup(props: RadioGroupType) {
  let { children, label, description, errorMessage } = props;
  let state = useRadioGroupState(props);
  let { radioGroupProps, labelProps, descriptionProps, errorMessageProps } =
    useRadioGroup(props, state);
  const [error, handleInputErrorChange] = useError({
    errorMessage: props.errorMessage, action: props.action, onChangeUpdateError: state.selectedValue
  })

  return (
    <div {...radioGroupProps} className={props.className ?? 'primary-input-box'} style={{ gap: 10 }}>
      {error ?
        <p {...errorMessageProps} className="label error">
          {error}
        </p>
        :
        label && <label {...labelProps} className="label">
          {label}
        </label>
      }

      <RadioContext.Provider value={{ state, error }}>
        {children}
      </RadioContext.Provider>

      {description && (
        <div {...descriptionProps} style={{ fontSize: 12 }}>{description}</div>
      )}

    </div>
  );
}
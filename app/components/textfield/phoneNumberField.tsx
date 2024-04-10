import { forwardRef, useEffect, useRef, useState } from 'react';
import { AriaTextFieldProps, useTextField } from 'react-aria';
import { formatPhoneNumberIntl } from 'react-phone-number-input';
import PhoneInput from "react-phone-number-input/input"
import { useError } from '~/hooks/useError';

import { mergeRefs } from '~/lib/merge-refs';

type TextFieldProps = AriaTextFieldProps &
  React.InputHTMLAttributes<HTMLInputElement> & {
    action?: any;
    _defaultValue: string;
    theme?: "dark" | "light"
  }

const PhoneNumberField = forwardRef<HTMLInputElement, TextFieldProps>((props, forwardedRef) => {
  const ref = useRef<HTMLInputElement>(null)
  const { action, errorMessage, className, children, disabled, onChange, name, label, autoComplete = true, ...rest } = props
  const [error, handleInputErrorChange] = useError({ errorMessage, ref: ref, action })
  const { inputProps, labelProps, descriptionProps, errorMessageProps } = useTextField(props, ref)
  const [inputValue, setInputValue] = useState<string | undefined>(props._defaultValue)
  const handleChange = (value: any) => {
    handleInputErrorChange()
    value = formatPhoneNumberIntl(value)
    if (onChange) onChange(value)
  };

  return (
    <div className={className}>
      {error ?
        <p {...errorMessageProps} className="label error">
          {error}
        </p>
        :
        <label {...labelProps} className={`label ${props.theme ?? ""}`}>
          {label}
        </label>
      }

      <div className={`textfield-container ${error ? "error" : ""} ${props.isDisabled ? "disabled" : ""}`}>
        <PhoneInput
          smartCaret={false}
          className={`textfield-input ${props.theme ?? ""}`}
          {...inputProps}
          ref={mergeRefs([ref, forwardedRef])}
          required={props.required ?? false}
          name={name}
          autoComplete={name}
          value={inputValue}
          onChange={number => { setInputValue(number?.toString()); handleChange(number?.toString()) }}
        />

        <div className='input-border' />
      </div>
    </div>
  )
})

export default PhoneNumberField
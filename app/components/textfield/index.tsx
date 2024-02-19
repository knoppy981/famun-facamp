import React, { forwardRef, useRef, useEffect, useState } from 'react';
import { AriaTextFieldProps, useTextField } from 'react-aria';
import { useError } from '~/hooks/useError';
import { mergeRefs } from '~/lib/merge-refs';

type TextFieldProps = AriaTextFieldProps &
  React.InputHTMLAttributes<HTMLInputElement> & {
    action?: any;
    theme?: string
  }

const TextField = forwardRef<HTMLInputElement, TextFieldProps>((props, forwardedRef) => {
  const ref = useRef<HTMLInputElement>(null)
  const { action, errorMessage, className, label, onChange } = props
  const [error, handleInputErrorChange] = useError({
    errorMessage: errorMessage, action: action, ref: ref
  })
  const { inputProps, labelProps, descriptionProps, errorMessageProps } =
    useTextField(props, ref)

  const handleChange = (e: any) => {
    handleInputErrorChange()
    if (onChange) {
      onChange(e);
    }
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
        <input
          {...inputProps}
          ref={mergeRefs([ref, forwardedRef])}
          className={`textfield-input ${props.theme ?? ""}`}
          onChange={handleChange}
        />

        <div className='input-border' />
      </div>
    </div>
  )
})

export default TextField
import React, { forwardRef, useRef, useEffect, useState } from 'react';
import { AriaTextFieldProps, useTextField } from 'react-aria';
import { useError } from '~/hooks/useError';
import { mergeRefs } from '~/lib/merge-refs';

type TextFieldProps = AriaTextFieldProps &
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    action?: any
  }

const TextArea = forwardRef<HTMLTextAreaElement, TextFieldProps>((props, forwardedRef) => {
  const ref = useRef<HTMLTextAreaElement>(null)
  const { action, errorMessage, className, label, onChange } = props
  const [error, handleInputErrorChange] = useError({
    errorMessage: errorMessage, action: action, ref: ref
  })
  const { inputProps, labelProps, descriptionProps, errorMessageProps } =
    useTextField({ ...props, inputElementType: 'textarea' }, ref)

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
        <label {...labelProps} className="label">
          {label}
        </label>
      }

      <div className={`textarea-container ${error ? "error" : ""} ${props.isDisabled ? "disabled" : ""}`}>
        <textarea
          {...inputProps}
          ref={mergeRefs([ref, forwardedRef])}
          className={`textarea-input ${props.isDisabled ? "disabled" : ""}`}
          onChange={handleChange}
        />

        <div className='input-border' />
      </div>
    </div>
  )
})

export default TextArea
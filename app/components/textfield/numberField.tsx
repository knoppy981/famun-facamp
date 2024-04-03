import React, { forwardRef } from 'react';
import { useNumberFieldState } from 'react-stately';
import { AriaNumberFieldProps, useLocale, useNumberField } from 'react-aria';

import { useError } from '~/hooks/useError';

import Button from '../button';
import { mergeRefs } from '~/lib/merge-refs';
import { FiMinus, FiPlus } from 'react-icons/fi/index.js';

type NumberFieldProps = AriaNumberFieldProps &
  React.InputHTMLAttributes<HTMLInputElement> & {
    action?: any
  }

export const NumberField = forwardRef<HTMLInputElement, NumberFieldProps>((props, forwardedRef) => {
  const { locale } = useLocale();
  const state = useNumberFieldState({ ...props, locale });
  const inputRef = React.useRef(null);
  const [error, handleInputErrorChange] = useError({
    errorMessage: props.errorMessage, action: props.action, ref: inputRef
  })
  const {
    labelProps,
    groupProps,
    inputProps,
    incrementButtonProps,
    decrementButtonProps
  } = useNumberField(props, state, inputRef);

  return (
    <div className={props.className}>
      {error ?
        <p className="label error">
          {error}
        </p>
        :
        <label {...labelProps} className="label">
          {props.label}
        </label>
      }

      <div {...groupProps} className={`numberfield-container ${error ? "error" : ""} ${props.isDisabled ? "disabled" : ""}`}>
        <input {...inputProps} ref={mergeRefs([inputRef, forwardedRef])} className='numberfield-input' name={props.name}/>

        <div className='numberfield-buttons-container'>
          <Button {...incrementButtonProps}><FiPlus /></Button>
          <Button {...decrementButtonProps}><FiMinus /></Button>
        </div>

        <div className='input-border' />
      </div>
    </div>
  )
});

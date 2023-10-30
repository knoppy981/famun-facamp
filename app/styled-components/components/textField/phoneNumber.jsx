import { useEffect, useRef, useState } from 'react';
import { useTextField } from 'react-aria';
import { formatPhoneNumberIntl } from 'react-phone-number-input';

import * as S from './elements'
import PhoneInput from "react-phone-number-input/input"


const PhoneNumberField = (props) => {

  const [ref, setRef] = useState(null);

  const { label, name, onChange } = props
  const { inputProps, labelProps, descriptionProps, errorMessageProps } = useTextField(props, ref)

  const [value, setValue] = useState(props._defaultValue)
  useEffect(() => {
    onChange ?
      onChange(formatPhoneNumberIntl(value)) :
      null
    setErr(null);
  }, [value])

  // use error like this so I can remove the error when user starts to correct it
  const [err, setErr] = useState(props.err)
  useEffect(() => {
    if (props.err) ref?.focus()
    setErr(props.err)
  }, [props.err, props.action]);


  return (
    <>
      <S.Label
        {...labelProps}
        err={err}
      >
        {err ?? label}
      </S.Label>

      <S.Container err={err} disabled={inputProps.disabled}>
        <S.PhoneNumberInput
          className={`${err ? 'err' : ""}`}
          {...inputProps}
          ref={setRef}
          required={props.required ?? false}
          name={name}
          autoComplete={name}
          value={value}
          err={err}
          onChange={setValue}
        />
        <S.InputBorder />
      </S.Container>
    </>
  )
}

export default PhoneNumberField
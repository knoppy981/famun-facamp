import { useEffect, useRef, useState } from 'react';
import { useTextField } from 'react-aria';

import * as S from './elements'

const DefaultPhoneInputBox = (props) => {

  const [ref, setRef] = useState(null);
  const [value, setValue] = useState(props.value)

  const { label, name } = props
  const { inputProps, labelProps, descriptionProps, errorMessageProps } = useTextField(props, ref)

  // use error like this so I can remove the error when user starts to correct it
  const [err, setErr] = useState(props.err)

  useEffect(() => {
    ref?.focus()
    setErr(props.err)
  }, [props.err]);


  return (
    <S.InputWrapper>
      <S.Label
        {...labelProps}
        err={err}
      >
        {err ?? label}
      </S.Label>

      <S.InputContainer>
        <S.PhoneNumberInput
          {...inputProps}
          id={name}
          ref={ref}
          required
          name={name}
          type={props.type}
          autoComplete={name}
          autoFocus={props.autoFocus}
          value={value}
          err={err}
          onChange={() => {setValue; setErr(null)}}
        />
      </S.InputContainer>
    </S.InputWrapper>
  )
}

export default DefaultPhoneInputBox
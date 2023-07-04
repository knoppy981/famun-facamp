import { useEffect, useRef, useState } from 'react';

import * as S from './elements'

export const PhoneInputBox = (props) => {

  const [value, setValue] = useState(props.value)

  const err = props.err
  const name = props.name
  const inputRef = useRef(null)

  return (
    <S.InputWrapper>
      <S.Label
        htmlFor={name}
        err={err}
      >
        {err ?? props.text}
      </S.Label>

      <S.InputContainer>
        <S.PhoneNumberInput
          id={name}
          ref={inputRef}
          required
          name={name}
          type={props.type}
          autoComplete={name}
          autoFocus={props.autoFocus}
          aria-invalid={err ? true : undefined}
          aria-describedby={`${name}-error`}
          err={err}
          value={value}
          onChange={setValue}
        />
      </S.InputContainer>
    </S.InputWrapper>
  )
}

export default PhoneInputBox
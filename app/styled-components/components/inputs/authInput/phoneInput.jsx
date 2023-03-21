import { useEffect, useRef, useState } from 'react';

import * as S from './elements'

export const PhoneInputBox = (props) => {

  const [mask, setMask] = useState(getMask(''));

  function getMask(ddd) {
    switch (ddd) {
      case '55':
        return '+99 (99) 99999-9999';
      case '1':
        return '+99 (999) 999-9999';
      case '44':
        return '+99 99999 999999'
      default:
        return '+99 (99) 99999-9999';
    }
  };

  /* const [err, setErr] = useState(false) */
  const err = props.err
  const name = props.name
  const inputRef = useRef(null)

  /* useEffect(() => {
    if (props.err) {
      inputRef.current?.focus()
    } 
  }, [props]); */

  return (
    <S.InputWrapper>
      <S.Label
        htmlFor={name}
        err={err}
      >
        {err ?? props.text}
      </S.Label>

      <S.InputContainer>
        {/* <S.Select>
          {[55, 44, 1, 23].map((item, index) => (
            <option>+{item}</option>
          ))}
        </S.Select> */}

        <S.Input
          id={name}
          ref={inputRef}
          required
          name={name}
          type={props.type}
          autoComplete={name}
          defaultValue={props.value}
          autoFocus={props.autoFocus}
          aria-invalid={err ? true : undefined}
          /* onFocus={() => setErr(false)} */
          aria-describedby={`${name}-error`}
          err={err}
          mask={mask}
          onChange={(e) => {
            const newDdd = e.target.value.substring(1, 3);
            setMask(getMask(newDdd));
          }}
        />
      </S.InputContainer>
    </S.InputWrapper>
  )
}

export default PhoneInputBox
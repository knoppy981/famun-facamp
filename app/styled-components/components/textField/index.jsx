import { useEffect, useRef, useState } from 'react';
import { useTextField } from 'react-aria';

import * as S from "./elements"

const TextField = (props) => {

  const [ref, setRef] = useState(null);
  const { label, name, onChange, autoComplete = true } = props
  const { inputProps, labelProps, descriptionProps, errorMessageProps } = useTextField(props, ref)

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

      <S.Input
        {...inputProps}
        required={props.required ?? false}
        inputRef={setRef}
        autoComplete={autoComplete ? name : "off"}
        onChange={e => { setErr(null); onChange ? onChange(e) : null }}
        err={err}
        mask={props.mask ?? undefined}
        formatChars={props.formatChars ?? undefined}
        maskChar="_"
      />
    </>
  )
}

export default TextField
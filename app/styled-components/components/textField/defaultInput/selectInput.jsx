import React from 'react'

import * as S from './elements'

const DefaultSelectInput = (props) => {

  const name = props.name
  const err = props.err

  return (
    <S.InputWrapper>
      <S.Label
        htmlFor={name}
        err={err}
      >
        {err ?? props.text}
      </S.Label>

      <S.Select
        id={name}
        required
        name={name}
        autoComplete={name}
        defaultValue={props.value}
        autoFocus={props.autoFocus}
        onChange={props?.func}
        err={err}
        style={{maxWidth: props?.maxWidth}}
      >
        {props.selectList.map((item, index) => (
          <option key={`${name}-option-${index}`}>{item}</option>
        ))}
      </S.Select>
    </S.InputWrapper>
  )
}

export default DefaultSelectInput
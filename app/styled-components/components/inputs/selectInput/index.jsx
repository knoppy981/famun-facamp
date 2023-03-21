import React from 'react'

import * as S from './elements'

const SelectInput = (props) => {

  const name = props.name
  const err = props.err

  return (
    <S.Container>
      <S.Label
        htmlFor={name}
        err={err}
      >
        {err ?? props.text}
      </S.Label>

      <S.AdvisorRoleSelect
        id={name}
        required
        name={name}
        autoComplete={name}
        defaultValue={props.value}
        autoFocus={props.autoFocus}
        aria-invalid={err ? true : undefined}
        /* onFocus={() => setErr(false)} */
        aria-describedby={`${name}-error`}
        err={err}
        style={{maxWidth: props?.maxWidth}}
      >
        {props.selectList.map((item, index) => (
          <option key={`${name}-option-${index}`}>{item}</option>
        ))}
      </S.AdvisorRoleSelect>
    </S.Container>
  )
}

export default SelectInput
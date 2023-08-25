import React from 'react'

import * as S from './elements'

const DataChangeSelectInput = (props) => {

  const name = props.name
  const err = props.err

  return (
    <React.Fragment>
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
        onChange={props.handleChange}
        disabled={props.disabled}
      >
        {props.selectList.map((item, index) => (
          <option key={`option-${item}`}>{item}</option>
        ))}
      </S.Select>
    </React.Fragment>
  )
}

export default DataChangeSelectInput
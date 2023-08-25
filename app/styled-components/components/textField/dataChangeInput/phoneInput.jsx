import { useEffect, useRef, useState } from 'react';

import * as S from './elements'
import PhoneInput from "react-phone-number-input"

const DataChangePhoneInputBox = (props) => {

  const [value, setValue] = useState(props.value)

  const err = props.err
  const name = props.name

  return (
    <React.Fragment>
      <S.Label
        htmlFor={name}
        err={err}
      >
        {err ?? props.text}
      </S.Label>

      <S.PhoneInputContainer disabled={props.disabled} err={err}>
        <PhoneInput 
          id={name}
          required
          name={name}
          type={props.type}
          autoComplete={name}
          err={err}
          value={props.value}
          onChange={props.handleChange}
          disabled={props.disabled}
        />
      </S.PhoneInputContainer>
    </React.Fragment>
  )
}

export default DataChangePhoneInputBox
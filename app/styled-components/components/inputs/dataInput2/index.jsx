import { useState, useRef, useEffect } from 'react'

import * as S from './elements'
import { FiEdit } from "react-icons/fi";

export const DataInput2 = (props) => {

  const inputRef = useRef(null)
  
  const err = props.err
	const name = props.name

/*   useEffect(() => {
    inputRef.current.value = props.value
  }, []) */

  return (
    <S.InputWrapper>
			<S.Label
				htmlFor={name}
				err={err ? true : false}
			>
				{err ? props.err : props.text}
			</S.Label>

			<S.InputContainer>
				<S.Input
					id={name}
					ref={inputRef}
          onChange={props.handleChange(name)}
					required
					name={name}
					type={props.type}
					autoComplete={name}
					autoFocus={props.autoFocus}
					defaultValue={props.value}
					aria-invalid={err ? true : undefined}
					aria-describedby={`${name}-error`}
					disabled={props.disabled}
				/>
			</S.InputContainer>
		</S.InputWrapper>
  )
}

export default DataInput2
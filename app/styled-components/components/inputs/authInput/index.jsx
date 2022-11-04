import { useEffect, useRef } from 'react';

import * as S from './elements'

export const AuthInputBox = (props) => {

	const err = props.err
	const name = props.name
	const inputRef = useRef(null)

	useEffect(() => {
    if (err) {
			inputRef.current?.focus()
		}
  }, [err, props]);

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
					required
					name={name}
					type={props.type}
					autoComplete={name}
					autoFocus={props.autoFocus}
					aria-invalid={err ? true : undefined}
					aria-describedby={`${name}-error`}
				/>
			</S.InputContainer>
		</S.InputWrapper>
	)
}

export default AuthInputBox
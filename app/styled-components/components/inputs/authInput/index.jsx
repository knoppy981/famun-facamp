import { useEffect, useRef, useState } from 'react';

import * as S from './elements'

export const AuthInputBox = (props) => {

	/* const [err, setErr] = useState(false) */
	const err = props.err
	const name = props.name
	const inputRef = useRef(null)

	useEffect(() => {
		if (props.err) {
			/* setErr(true) */
			inputRef.current?.focus()
		} /* else { setErr(false) } */
	}, [props]);

	return (
		<S.InputWrapper>
			<S.Label
				htmlFor={name}
				err={err}
			>
				{err ?? props.text}
			</S.Label>

			<S.InputContainer>
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
				/>
			</S.InputContainer>
		</S.InputWrapper>
	)
}

export default AuthInputBox
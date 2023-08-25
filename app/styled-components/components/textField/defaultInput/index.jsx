import { useEffect, useRef, useState } from 'react';
import { useTextField } from 'react-aria';

import * as S from './elements'

const TextField = (props) => {
	const [ref, setRef] = useState(null);
	const { label, name } = props
	const { inputProps, labelProps, descriptionProps, errorMessageProps } = useTextField(props, ref)

	// use error like this so I can remove the error when user starts to correct it
	const [err, setErr] = useState(props.err)

	useEffect(() => {
		ref?.focus()
		setErr(props.err)
	}, [props.err]);

	return (
		<S.InputWrapper>
			<S.Label
				{...labelProps}
				err={err}
			>
				{err ?? label}
			</S.Label>

			<S.Input
				{...inputProps}
				required
				inputRef={setRef}
				autoComplete={name}
				onChange={() => setErr(null)}
				err={err}
				mask={props.mask ?? undefined}
				formatChars={props.formatChars ?? undefined}
				maskChar="_"
			/>
		</S.InputWrapper>
	)
}

export default TextField
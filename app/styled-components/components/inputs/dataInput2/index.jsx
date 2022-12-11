import { useState, useRef, useEffect } from 'react'

import * as S from './elements'
import { FiEdit } from "react-icons/fi";

export const DataInput2 = (props) => {

	const [err, setErr] = useState(undefined)
	const [confirmValue, setConfirmValue] = useState(undefined)
	const name = props.name
	const inputRef = useRef(null)

	useEffect(() => {
		if (props.actionData?.errors?.[name]) {
			setErr(props.actionData?.errors?.[name])
			inputRef.current?.focus()
		} else if (props.actionData?.values?.[name]) {
			setConfirmValue(props.actionData?.values?.[name])
		} else {
			setErr(undefined)
			setConfirmValue(undefined)
		}
	}, [props.actionData]);

	return (
		<S.InputWrapper>
			<S.Label
				htmlFor={name}
				err={err ? true : false}
				confirmValue={confirmValue ? true : false}
			>
				{err ? err : confirmValue ? `${props.text} alterado!` : props.text}
			</S.Label>

			<S.InputContainer>
				<S.Input
					id={name}
					ref={inputRef}
					onChange={props.handleChange(name)}

					err={err ? true : false}
					confirmValue={confirmValue ? true : false}
					onBlur={() => { setErr(undefined); setConfirmValue(undefined) }}
					disabled={props.disabled}

					required
					name={name}
					type={props.type}
					autoComplete={name}
					autoFocus={props.autoFocus}
					defaultValue={props.value}
					aria-invalid={err ? true : undefined}
					aria-describedby={`${name}-error`}
				/>
			</S.InputContainer>
		</S.InputWrapper>
	)
}

export default DataInput2
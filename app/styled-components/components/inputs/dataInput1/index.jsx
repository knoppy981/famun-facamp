import { useState, useRef, useEffect } from 'react'

import * as S from './elements'
import { FiAlertTriangle } from "react-icons/fi"
import { FiEdit } from "react-icons/fi";

export const DataInput1 = (props) => {

	const [inputFocus, setInputFocus] = useState(props.value ? false : true)
	const inputRef = useRef(null)

	useEffect(() => {
		if (!inputFocus) inputRef.current.value = ''
	}, [inputFocus])

	const err = props.err
	const name = props.name

	return (
		<S.ValueBox focused={inputFocus} err={err}>
			<S.KeyLabel
				focused={inputFocus}
				htmlFor={name}
			>
				{props.text}
			</S.KeyLabel>
			<S.ValueLabel
				focused={inputFocus}
				err={err}
				htmlFor={name}
			>
				{props.value}
			</S.ValueLabel>
			<S.ValueInput
				ref={inputRef}
				id={name}
				name={name}
				type={props.type}
				autoComplete={name}
				disabled={!inputFocus}
				placeholder={props.placeholder}
			/>
			<S.EditButton
				onClick={() => setInputFocus(!inputFocus)}
				focused={inputFocus}
				disabled={props.disabled}
			>
				<FiEdit />
			</S.EditButton>
		</S.ValueBox>
	)
}

export default DataInput1
import React, { useEffect, useRef, useState } from 'react';

import * as S from './elements'

const DataChangeInputBox = (props) => {

	// use error like this so I can remove the error when user starts to correct it
	const [err, setErr] = useState(props.err)
	const name = props.name
	const [inputEl, setInputEl] = useState(null);

	useEffect(() => {
		inputEl?.focus()
		setErr(props.err)
	}, [props.err]);

	return (
		<React.Fragment>
			<S.Label
				htmlFor={name}
				err={err}
			>
				{err ?? props.text}
			</S.Label>

			<S.Input
				id={name}
				required
				inputRef={setInputEl}
				name={name}
				type={props.type}
				autoComplete={name}
				err={err}
				value={props.value}
				onChange={e => {props.handleChange(e); setErr(null)}}
				disabled={props.disabled}
				mask={props.mask}
			/>
		</React.Fragment>
	)
}

export default DataChangeInputBox
import { useEffect, useRef, useState } from 'react';

import * as S from './elements'

const DataChangeDateInputBox = (props) => {
	let mask = 'dD/mM/YYYY';
	let formatChars = {
		'Y': '[0-9]',
		'd': '[0-3]',
		'D': '[0-9]',
		'm': '[0-1]',
		'M': '[1-9]'
	};

	let beforeMaskedValueChange = (newState, oldState, userInput) => {
		let { value } = newState;

		let dateParts = value.split('/');
		let dayPart = dateParts[0];
		let monthPart = dateParts[1];

		// Conditional mask for the 2nd digit of day based on the first digit
		if (dayPart?.startsWith('3'))
			formatChars['D'] = '[0-1]'; // To block 39, 32, etc.
		else if (dayPart?.startsWith('0'))
			formatChars['D'] = '[1-9]'; // To block 00.
		else
			formatChars['D'] = '[0-9]'; // To allow 05, 15, 25  etc.


		// Conditional mask for the 2nd digit of month based on the first digit
		if (monthPart?.startsWith('1'))
			formatChars['M'] = '[0-2]'; // To block 15, 16, etc.
		else
			formatChars['M'] = '[1-9]'; // To allow 05, 06  etc - but blocking 00.

		return { value, selection: newState.selection };
	}

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
				
				mask={mask}
				maskChar={null}
				formatChars={formatChars}
				beforeMaskedValueChange={beforeMaskedValueChange}
			/>
		</React.Fragment>
	)
}

export default DataChangeDateInputBox
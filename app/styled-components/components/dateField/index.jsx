import { useDateFieldState } from 'react-stately';
import { useDateField, useDateSegment, useLocale } from 'react-aria';
import { createCalendar } from '@internationalized/date';

import * as S from "./elements"

const DateField = (props) => {
  let { locale } = useLocale();
  const { setIsFocused } = props
  let state = useDateFieldState({
    ...props,
    locale,
    createCalendar
  });

  let ref = React.useRef(null);
  let { labelProps, fieldProps } = useDateField(props, state, ref);

  return (
    <S.Wrapper>
      <span {...labelProps}>{props.label}</span>
      <S.Container {...fieldProps} ref={ref} className="field">
        {state.segments.map((segment, i) => (
          <DateSegment key={i} segment={segment} state={state} setIsFocused={setIsFocused}/>
        ))}
        {state.validationState === 'invalid' &&
          <span aria-hidden="true">🚫</span>}
      </S.Container>
    </S.Wrapper>
  );
}

const DateSegment = ({ segment, state, setIsFocused }) => {
  let ref = React.useRef(null);
  let { segmentProps } = useDateSegment(segment, state, ref);

  return (
    <S.DataSegment
      {...segmentProps}
      ref={ref}
      isPlaceholder={segment.isPlaceholder}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      {segment.text}
    </S.DataSegment>
  );
}

export default DateField
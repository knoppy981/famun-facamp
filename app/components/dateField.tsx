import React from 'react';
import type { DateFieldState, DateSegment, } from "react-stately"
import { useDateFieldState } from 'react-stately';
import { useDateField, useDateSegment, useLocale } from 'react-aria';
import { createCalendar } from '@internationalized/date';
import { AriaDateFieldOptions, DateValue } from '@react-aria/datepicker';

const DateField = <T extends DateValue>(props: AriaDateFieldOptions<T>) => {
  const { locale } = useLocale();
  const state = useDateFieldState({
    ...props,
    locale,
    createCalendar
  });

  const ref = React.useRef(null);
  const { labelProps, fieldProps } = useDateField(props, state, ref);

  return (
    <div className='date-field-wrapper'>
      <span {...labelProps}>{props.label}</span>
      <div {...fieldProps} ref={ref} className="date-field-container">
        {state.segments.map((segment, i) => (
          <DateSegment key={i} segment={segment} state={state} />
        ))}
        {state.isInvalid &&
          <span aria-hidden="true">🚫</span>}
      </div>
    </div>
  );
}

const DateSegment = ({ segment, state }: { segment: DateSegment; state: DateFieldState }) => {
  const ref = React.useRef(null);
  const { segmentProps } = useDateSegment(segment, state, ref);

  return (
    <div
      className='date-field-segment'
      {...segmentProps}
      ref={ref}
    >
      {segment.text}
    </div>
  );
}

export default DateField
import React from 'react';
import { AriaCalendarProps, DateValue, useCalendar, useCalendarCell, useCalendarGrid, useLocale } from 'react-aria';
import { CalendarState, useCalendarState } from 'react-stately';
import { CalendarDate, createCalendar, getLocalTimeZone, getWeeksInMonth, today } from '@internationalized/date';

import { FiChevronLeft, FiChevronRight } from 'react-icons/fi/index.js';
import Button from './button';

const Calendar = (props: AriaCalendarProps<DateValue>) => {
  const { locale } = useLocale();
  const state = useCalendarState({
    ...props,
    locale,
    createCalendar
  });

  const { calendarProps, prevButtonProps, nextButtonProps, title } = useCalendar(
    props,
    state
  );

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    state.setFocusedDate(
      new CalendarDate(parseInt(e.target.value), state.focusedDate.month, state.focusedDate.day))
  }

  const splitStringAtYear = (inputString: string): string[] => {
    const yearRegex = /\b\d{4}\b/;
    return inputString.split(yearRegex).map(s => s.trim());
  };

  const maxYear = state.maxValue?.year ?? today(getLocalTimeZone()).year
  const minYear = state.minValue?.year ?? 1900
  const yearRange: number = maxYear + 1 - minYear

  return (
    <div {...calendarProps} className="calendar">
      <div className="calendar-header">
        <Button {...prevButtonProps} className={`default-button ${prevButtonProps.isDisabled ? "disabled" : ""}`}>
          <FiChevronLeft className='icon' />
        </Button>

        <div style={{ fontSize: "inherit", display: "flex", gap: "3px" }}>
          <h2>{splitStringAtYear(title)[0]}</h2>

          <select onChange={handleYearChange} value={state.focusedDate.year} className='calender-year-select'>
            {Array.from({ length: yearRange }, (_, index) => (
              <option key={index} title={String(minYear + index)} value={minYear + index}>
                {minYear + index}
              </option>
            ))}
          </select>
          
          <h2>{splitStringAtYear(title)[1]}</h2>
        </div>

        <Button {...nextButtonProps} className={`default-button ${nextButtonProps.isDisabled ? "disabled" : ""}`}>
          <FiChevronRight className='icon' />
        </Button>
      </div>
      <CalendarGrid state={state} />
    </div>
  );
}

const CalendarGrid = ({ state, ...props }: { state: CalendarState }) => {
  const { locale } = useLocale();
  const { gridProps, headerProps, weekDays } = useCalendarGrid(props, state);

  // Get the number of weeks in the month so we can render the proper number of rows.
  const weeksInMonth = getWeeksInMonth(state.visibleRange.start, locale);

  return (
    <table {...gridProps}>
      <thead {...headerProps} style={{ margin: "10 0" }}>
        <tr>
          {weekDays.map((day, index) =>
            <th key={index} className='calendar-header-item'>
              {day}
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {[...new Array(weeksInMonth).keys()].map((weekIndex) => (
          <tr key={weekIndex}>
            {state.getDatesInWeek(weekIndex).map((date, i) => (
              date
                ? (
                  <CalendarCell
                    key={i}
                    state={state}
                    date={date}
                  />
                )
                : <td key={i} />
            )
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const CalendarCell = ({ state, date }: { state: CalendarState; date: CalendarDate }) => {
  const ref = React.useRef(null);
  const {
    cellProps,
    buttonProps,
    isSelected,
    isOutsideVisibleRange,
    isDisabled,
    isUnavailable,
    formattedDate
  } = useCalendarCell({ date }, state, ref);

  return (
    <td {...cellProps} style={{ padding: "5px 2px" }}>
      <div
        className={`calendar-item 
          ${isSelected ? 'selected' : ''} 
          ${isDisabled ? 'disabled' : ''} 
          ${isUnavailable ? 'unavailable' : ''}
        `}
        {...buttonProps}
        ref={ref}
        hidden={isOutsideVisibleRange}
      >
        {formattedDate}
      </div>
    </td>
  );
}

export default Calendar
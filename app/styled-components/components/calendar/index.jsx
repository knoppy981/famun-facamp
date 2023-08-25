import { useCalendar, useCalendarCell, useCalendarGrid, useLocale } from 'react-aria';
import { useCalendarState } from 'react-stately';
import { createCalendar, getWeeksInMonth } from '@internationalized/date';
import Button from '../button';

import * as S from "./elements"
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Calendar = (props) => {
  let { locale } = useLocale();
  let state = useCalendarState({
    ...props,
    locale,
    createCalendar
  });

  let { calendarProps, prevButtonProps, nextButtonProps, title } = useCalendar(
    props,
    state
  );

  return (
    <S.Calendar {...calendarProps} className="calendar">
      <S.Header className="header">
        <Button {...prevButtonProps}><FiChevronLeft /></Button>
        <h2>{title}</h2>
        <Button {...nextButtonProps}><FiChevronRight /></Button>
      </S.Header>
      <CalendarGrid state={state} />
    </S.Calendar>
  );
}

const CalendarGrid = ({ state, ...props }) => {
  let { locale } = useLocale();
  let { gridProps, headerProps, weekDays } = useCalendarGrid(props, state);

  // Get the number of weeks in the month so we can render the proper number of rows.
  let weeksInMonth = getWeeksInMonth(state.visibleRange.start, locale);

  return (
    <table {...gridProps}>
      <thead {...headerProps}>
        <tr>
          {weekDays.map((day, index) =>
            <S.HeaderItem key={index}>
              {day}
            </S.HeaderItem>
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
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const CalendarCell = ({ state, date }) => {
  let ref = React.useRef(null);
  let {
    cellProps,
    buttonProps,
    isSelected,
    isOutsideVisibleRange,
    isDisabled,
    isUnavailable,
    formattedDate
  } = useCalendarCell({ date }, state, ref);

  return (
    <td {...cellProps}>
      <S.Item
        {...buttonProps}
        ref={ref}
        hidden={isOutsideVisibleRange}
        selected={isSelected}
        disabled={isDisabled}
        unavailable={isUnavailable}
      >
        {formattedDate}
      </S.Item>
    </td>
  );
}

export default Calendar
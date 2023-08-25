import { useEffect, useRef, useState } from 'react';
import { useDatePicker } from 'react-aria';
import { useDatePickerState } from 'react-stately';

import { FiCalendar } from 'react-icons/fi';
import { FcCalendar } from 'react-icons/fc'

import Button from '../button';
import DateField from '../dateField';
import Popover from '../popover';
import Dialog from '../dialog';
import Calendar from '../calendar';
import * as S from "./elements"

const DatePicker = (props) => {
  let state = useDatePickerState(props);

  let ref = useRef(null);
  let buttonRef = useRef(null)
  let popoverRef = useRef(null);

  let {
    groupProps,
    labelProps,
    fieldProps,
    buttonProps,
    dialogProps,
    calendarProps
  } = useDatePicker(props, state, ref);

  const [err, setErr] = useState(props.err)
  useEffect(() => {
    setErr(props.err)
  }, [props.err, props.action]);

  useEffect(() => {
    setErr(null)
  }, [state.value])

  return (
    <>
      <S.Label {...labelProps} err={err} >{err ?? props.label}</S.Label>

      <S.Box
        {...groupProps}
        err={err}
        ref={ref}
        disabled={props.isDisabled}
        isFocused={state.isOpen}
      >
        <DateField {...fieldProps} name={props.name} />
        
        {!props.isDisabled &&
          <Button {...buttonProps} buttonRef={buttonRef}>
            <FcCalendar />
          </Button>
        }
      </S.Box>

      {state.isOpen &&
        (
          <Popover
            state={state}
            popoverRef={popoverRef}
            triggerRef={ref}
            placement="bottom"
            offset={10}
          >
            <Dialog {...dialogProps}>
              <Calendar {...calendarProps} />
            </Dialog>
          </Popover>
        )}

      <input type="hidden" name={props.name} value={state.value ?? ""} />
    </>
  );
}

export default DatePicker
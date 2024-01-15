import React, { useEffect, useRef, useState } from 'react';
import { AriaDatePickerProps, DateValue, useDatePicker } from 'react-aria';
import { useDatePickerState } from 'react-stately';

import { FiCalendar } from 'react-icons/fi/index.js';
import { FcCalendar } from 'react-icons/fc/index.js'

import Button from './button';
import DateField from './dateField';
import Popover from './popover';
import Dialog from './dialog';
import Calendar from './calendar';

import { AnimatePresence } from 'framer-motion';
import { useError } from '~/hooks/useError';

type DatePickerProps = AriaDatePickerProps<DateValue> & {
  className?: string,
  action: any
}

const DatePicker = (props: DatePickerProps) => {
  const state = useDatePickerState(props);
  const ref = useRef(null);
  const {
    groupProps,
    labelProps,
    fieldProps,
    buttonProps,
    dialogProps,
    calendarProps
  } = useDatePicker(props, state, ref);

  const [error, handleInputErrorChange] = useError({ 
    errorMessage: props?.errorMessage, ref: ref, action: props?.action, onChangeUpdateError: state.value })

  return (
    <div className={props.className}>
      {error ?
        <p className="label error">
          {error}
        </p>
        :
        <label {...labelProps} className="label">
          {props.label}
        </label>
      }

      <div
        className={`date-picker-container ${error ? "error" : ""} ${props.isDisabled ? "disabled" : ""}`}
        {...groupProps}
        ref={ref}
      >
        <DateField {...fieldProps} name={props.name} />

        <div className='input-border' />

        {!props.isDisabled &&
          <Button {...buttonProps} className='default-button'>
            <FcCalendar className='icon'/>
          </Button>
        }
      </div>

      <AnimatePresence>
        {state.isOpen &&
          (
            <Popover
              state={state}
              triggerRef={ref}
              placement="bottom"
              offset={10}
            >
              <Dialog {...dialogProps}>
                <Calendar {...calendarProps} />
              </Dialog>
            </Popover>
          )}
      </AnimatePresence>

      <input type="hidden" name={props.name} value={state.value ? state.value.toString() : ""} />
    </div>
  );
}

export default DatePicker
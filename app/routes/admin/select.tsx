import { Item, useSelectState } from 'react-stately';
import { AriaSelectProps, HiddenSelect, useSelect } from 'react-aria';

import Button from '~/components/button';
import Popover from '~/components/popover';
import ListBox from '~/components/listBox';
import { FiChevronDown } from 'react-icons/fi/index.js';
import { AnimatePresence } from 'framer-motion';
import React from 'react';
import { useError } from '~/hooks/useError';

export { Item, Section } from "react-stately";

type SelectProps<T> = AriaSelectProps<T> & {
  hideLabel?: boolean,
  className?: string,
  action?: any,
  onChangeUpdateError?: any,
}

export const Select = <T extends object>(props: SelectProps<T>) => {
  let state = useSelectState(props);

  let buttonRef = React.useRef(null);
  let listBoxRef = React.useRef(null);
  let popoverRef = React.useRef(null);

  let {
    labelProps,
    triggerProps,
    valueProps,
    menuProps
  } = useSelect(props, state, buttonRef)

  return (
    <div className={props.className}>
      <div className=''>
        <HiddenSelect
          isDisabled={props.isDisabled}
          state={state}
          triggerRef={buttonRef}
          label={props.label}
          name={props.name}
        />

        <Button
          {...triggerProps}
          ref={buttonRef}
        >
          <span {...valueProps}>
            {state.selectedItem
              ? state.selectedItem.rendered
              : props.placeholder}
          </span>
          {!props.isDisabled &&
            <span
              aria-hidden="true"
            >
              <FiChevronDown className='icon' style={{ transform: `translateY(1px) ${state.isOpen ? "rotate(-180deg)" : ""}` }} />
            </span>}
        </Button>
      </div>

      <AnimatePresence>
        {state.isOpen &&
          (
            <Popover
              state={state}
              ref={popoverRef}
              triggerRef={buttonRef}
              placement="bottom"
              offset={20}
            >
              <ListBox
                {...menuProps}
                state={state}
                listBoxRef={listBoxRef}
              />
            </Popover>
          )}
      </AnimatePresence>
    </div>
  );
}
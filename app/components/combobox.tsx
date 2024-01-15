import React, { ReactNode } from "react";
import { useComboBoxState } from "react-stately";
import { AriaComboBoxProps, useComboBox, useFilter } from "react-aria";
import { AnimatePresence } from "framer-motion";

import ListBox from "./listBox";
import Popover from "./popover";
import Button from "./button";
import { FiChevronDown } from "react-icons/fi/index.js";
import { useError } from "~/hooks/useError";

export { Item, Section } from "react-stately";

interface ComboBoxProps extends AriaComboBoxProps<any> {
  leftItem?: ReactNode;
  className?: string;
  action: any;
}

const ComboBox = (props: ComboBoxProps) => {
  // Setup filter function and state.
  const { contains } = useFilter({ sensitivity: 'base' });
  const state = useComboBoxState({ ...props, defaultFilter: contains });

  // Setup refs and get props for child elements.
  const buttonRef = React.useRef(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listBoxRef = React.useRef(null);
  const popoverRef = React.useRef(null);

  const { buttonProps, inputProps, listBoxProps, labelProps } = useComboBox(
    {
      ...props,
      inputRef,
      buttonRef,
      listBoxRef,
      popoverRef
    },
    state
  );

  const [error, handleInputErrorChange] = useError({ 
    errorMessage: props.errorMessage, action: props.action, ref: inputRef })

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

      <div className={`combo-box ${error ? "error" : ""} ${props.isDisabled ? "disabled" : ""}`}>
        {props.leftItem}

        <input
          {...inputProps}
          ref={inputRef}
          className="combo-box-input"
        />

        <div className="input-border" />

        {!props.isDisabled &&
          <Button
            {...buttonProps}
            ref={buttonRef}
            type='button'
          >
            <span
              aria-hidden="true"
            >
              <FiChevronDown className="icon"/>
            </span>
          </Button>
        }

        <AnimatePresence>
          {state.isOpen &&
            (
              <Popover
                state={state}
                triggerRef={inputRef}
                ref={popoverRef}
                isNonModal
                placement="bottom"
                offset={10}
              >
                <ListBox
                  {...listBoxProps}
                  ref={listBoxRef}
                  state={state}
                />
              </Popover>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ComboBox
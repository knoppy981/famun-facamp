import { useComboBoxState } from "react-stately";
import { useComboBox, useFilter } from "react-aria";

import * as S from "./elements"
import { FiChevronDown } from "react-icons/fi";
import ListBox from '../listBox';
import Popover from '../popover';
import Button from '../button';
import { AnimatePresence } from "framer-motion";

export { Item, Section } from "react-stately";

export function ComboBox(props) {
  // Setup filter function and state.
  let { contains } = useFilter({ sensitivity: 'base' });
  let state = useComboBoxState({ ...props, defaultFilter: contains });

  // Setup refs and get props for child elements.
  let buttonRef = React.useRef(null);
  let inputRef = React.useRef(null);
  let listBoxRef = React.useRef(null);
  let popoverRef = React.useRef(null);

  let { buttonProps, inputProps, listBoxProps, labelProps } = useComboBox(
    {
      ...props,
      inputRef,
      buttonRef,
      listBoxRef,
      popoverRef
    },
    state
  );

  const [err, setErr] = React.useState(props.err)
  React.useEffect(() => {
    setErr(props.err)
  }, [props.err, props.action]);

  React.useEffect(() => {
    setErr(null)
  }, [state.inputValue])

  return (
    <>
      <S.Label {...labelProps} err={err} >{err ?? props.label}</S.Label>

      <S.Container isFocused={state.isFocused} disabled={props.isDisabled}>
        {props.leftItem}

        <S.Input
          isFocused={state.isFocused}
          {...inputProps}
          ref={inputRef}
        />

        {!props.isDisabled &&
          <Button
            {...buttonProps}
            buttonRef={buttonRef}
            type='button'
          >
            <span
              aria-hidden="true"
            >
              <FiChevronDown />
            </span>
          </Button>
        }

        <AnimatePresence>
          {state.isOpen &&
            (
              <Popover
                state={state}
                triggerRef={inputRef}
                popoverRef={popoverRef}
                isNonModal
                placement="bottom"
                offset={10}
              >
                <ListBox
                  {...listBoxProps}
                  listBoxRef={listBoxRef}
                  state={state}
                />
              </Popover>
            )}
        </AnimatePresence>
      </S.Container>
    </>
  );
}

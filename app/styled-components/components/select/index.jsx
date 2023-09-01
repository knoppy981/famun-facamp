import { Item, useSelectState } from 'react-stately';
import { HiddenSelect, useSelect } from 'react-aria';

import * as S from "./elements"
// Reuse the ListBox, Popover, and Button from your component library. See below for details.
import Button from '../button';
import Popover from '../popover';
import ListBox from '../listBox';
import { FiChevronDown } from 'react-icons/fi';

export { Item, Section } from "react-stately";

export const Select = (props) => {
  // Create state based on the incoming props
  let state = useSelectState(props);

  // Get props for child elements from useSelect
  let buttonRef = React.useRef(null);
  let listBoxRef = React.useRef(null);
  let popoverRef = React.useRef(null);

  let {
    labelProps,
    triggerProps,
    valueProps,
    menuProps
  } = useSelect(props, state, buttonRef);

  const [error, setError] = React.useState(null)
  React.useEffect(() => {
    setError(props.err)
  }, [props.err]);

  React.useEffect(() => {
    setError(null)
  }, [state.selectedKey])

  return (
    <>
      {!props.hideLabel && <S.Label {...labelProps} err={error}>{error ?? props.label}</S.Label>}
      <S.Box disabled={props.isDisabled}>
        <HiddenSelect
          isDisabled={props.isDisabled}
          state={state}
          triggerRef={buttonRef}
          label={props.label}
          name={props.name}
        />
        <Button
          {...triggerProps}
          buttonRef={buttonRef}
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
              <FiChevronDown />
            </span>}
        </Button>
      </S.Box>
      {state.isOpen &&
        (
          <Popover
            state={state}
            popoverRef={popoverRef}
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
    </>
  );
}
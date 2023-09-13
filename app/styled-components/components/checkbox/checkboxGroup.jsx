import { useCheckboxGroupState, } from 'react-stately';
import { useCheckboxGroup, useCheckboxGroupItem } from 'react-aria';
import { useTooltipTriggerState } from 'react-stately';
import { mergeProps, useTooltipTrigger } from 'react-aria';
import Tooltip from '../tooltip';

import * as S from "./elements"

let CheckboxGroupContext = React.createContext(null);

export const Checkbox = (props) => {
  let { children } = props;
  let state = React.useContext(CheckboxGroupContext);
  let ref = React.useRef(null);
  let { inputProps } = useCheckboxGroupItem(props, state, ref);

  let tooltipState = useTooltipTriggerState(props);
  let tooltipRef = React.useRef(null);
  let { triggerProps, tooltipProps } = useTooltipTrigger({}, tooltipState, tooltipRef);

  let isDisabled = state.isDisabled || props.isDisabled;
  let isSelected = state.isSelected(props.value);

  return (
    <S.Label
      ref={tooltipRef}
      {...triggerProps}
      isDisabled={isDisabled}
      isSelected={isSelected}
    >
      <S.Input {...inputProps} ref={ref} />

      {children}

      {props.tooltip && isDisabled && tooltipState.isOpen && (
        <Tooltip state={tooltipState} {...tooltipProps}>{props.tooltip}</Tooltip>
      )}
    </S.Label>
  );
}

export const CheckboxGroup = (props) => {
  let { children, label, description, err, hideLabel } = props;
  let state = useCheckboxGroupState(props);
  let { groupProps, labelProps, descriptionProps, errorMessageProps } =
    useCheckboxGroup(props, state);

  const [error, setError] = React.useState(null)
  React.useEffect(() => {
    setError(err)
  }, [err, props.action]);

  React.useEffect(() => {
    setError(null)
  }, [state.value])

  return (
    <S.Group {...groupProps}>
      <S.CheckboxGroupLabel {...labelProps} err={error}>{hideLabel ? null : error ?? label}</S.CheckboxGroupLabel>
      <CheckboxGroupContext.Provider value={state}>
        {children}
      </CheckboxGroupContext.Provider>
      {description && (
        <div {...descriptionProps} style={{ fontSize: 12 }}>{description}</div>
      )}
    </S.Group>
  );
}
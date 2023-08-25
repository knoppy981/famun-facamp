import { useCheckboxGroupState, useToggleState } from 'react-stately';
import { useCheckboxGroup, useCheckboxGroupItem } from 'react-aria';

import * as S from "./elements"

let CheckboxGroupContext = React.createContext(null);

export const Checkbox = (props) => {
  let { children } = props;
  let state = React.useContext(CheckboxGroupContext);
  let ref = React.useRef(null);
  let { inputProps } = useCheckboxGroupItem(props, state, ref);

  let isDisabled = state.isDisabled || props.isDisabled;
  let isSelected = state.isSelected(props.value);

  return (
    <S.Label
      isDisabled={isDisabled}
      isSelected={isSelected}
    >
      <S.Input {...inputProps} ref={ref} />
      {children}
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
  }, [err]);

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
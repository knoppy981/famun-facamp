import {useListBox, useOption} from 'react-aria';

import * as S from './elements'

const ListBox = (props) => {
  let ref = React.useRef(null);
  let { listBoxRef = ref, state } = props;
  let { listBoxProps } = useListBox(props, state, listBoxRef);

  return (
    <S.List
      {...listBoxProps}
      ref={listBoxRef}
    >
      {[...state.collection].map((item) => (
        <Option
          key={item.key}
          item={item}
          state={state}
        />
      ))}
    </S.List>
  );
}

const Option = ({ item, state }) => {
  let ref = React.useRef(null);
  let { optionProps, isSelected, isFocused, isDisabled } = useOption(
    { key: item.key },
    state,
    ref
  );

  return (
    <S.ListItem
      {...optionProps}
      ref={ref}
      isSelected={isSelected}
      isFocused={isFocused}
      isDisabled={isDisabled}
    >
      {item.rendered}
    </S.ListItem>
  );
}

export default ListBox
import { mergeProps, useDraggableItem, useFocusRing, useOption, useDropIndicator, useDroppableItem } from 'react-aria';

import * as S from "./elements"

export const DropIndicator = (props) => {
  let ref = React.useRef(null);
  let { dropIndicatorProps, isHidden, isDropTarget } = useDropIndicator(
    props,
    props.dropState,
    ref
  );
  if (isHidden) {
    return null;
  }

  return (
    <S.Indicator
      {...dropIndicatorProps}
      role="option"
      ref={ref}
      isDropTarget={isDropTarget}
    />
  );
}

export const ReorderableOption = ({ item, state, dropState, dragState, isDisabled }) => {
  let ref = React.useRef(null);
  let { optionProps } = useOption({ key: item.key }, state, ref);
  let { isFocusVisible, focusProps } = useFocusRing();

  // Register the item as a drop target.
  let { dropProps, isDropTarget } = useDroppableItem(
    {
      target: { type: 'item', key: item.key, dropPosition: 'on' }
    },
    dropState,
    ref
  );

  let { dragProps } = useDraggableItem({
    key: item.key
  }, dragState);

  return (
    <>
      <DropIndicator
        target={{ type: 'item', key: item.key, dropPosition: 'before' }}
        dropState={dropState}
      />
      <S.StyledOption
        {...mergeProps(optionProps, dragProps, dropProps, focusProps)}
        ref={ref}
        isFocusVisible={isFocusVisible}
        isDropTarget={isDropTarget}
        isDisabled={isDisabled}
      >
        {item.rendered}
      </S.StyledOption>
      {state.collection.getKeyAfter(item.key) == null &&
        (
          <DropIndicator
            target={{ type: 'item', key: item.key, dropPosition: 'after' }}
            dropState={dropState}
          />
        )}
    </>
  );
}

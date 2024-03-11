import React from 'react'
import { mergeProps, useDraggableItem, useFocusRing, useOption, useDropIndicator, useDroppableItem, DropIndicatorProps } from 'react-aria';
import { DraggableCollectionState, DroppableCollectionState, ListState } from 'react-stately';

export const DropIndicator = (props: DropIndicatorProps & { dropState: DroppableCollectionState }) => {
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
    <li
      {...dropIndicatorProps}
      role="option"
      ref={ref}
      className={`reordable-list-indicator ${isDropTarget ? 'drop-target' : ''}`}
    />
  );
}

export const ReorderableOption = ({ item, state, dropState, dragState, isDisabled }:
  { item: any; state: ListState<object>; dropState: DroppableCollectionState; dragState: DraggableCollectionState, isDisabled: boolean }
) => {
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
      <li
        {...mergeProps(optionProps, dragProps, dropProps, focusProps)}
        ref={ref}
        className={`reordable-list-option 
          ${isFocusVisible ? 'focus-visible' : ''} 
          ${isDropTarget ? 'drop-target' : ''}
          ${isDisabled ? 'disabled' : ''}
        `}
      >
        {item.index + 1 + "° - "} {item.rendered}
      </li>
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

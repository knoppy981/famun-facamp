import React, { Key } from 'react';
import { useDroppableCollectionState, useDraggableCollectionState, useListState, ListProps } from 'react-stately';
import { ListDropTargetDelegate, ListKeyboardDelegate, mergeProps, useDroppableCollection, useListBox, useDraggableCollection, DraggableCollectionOptions, DragItem } from 'react-aria';

import { ReorderableOption } from './option';

export { Item, Section } from "react-stately";

export const ReorderableListBox = (props: any): JSX.Element => {
  const { className, label, isDisabled, ...defaultProps } = props
  // See useListBox docs for more details.
  const state = useListState(defaultProps as ListProps<object>);
  const ref = React.useRef(null);
  const { listBoxProps } = useListBox(
    {
      ...defaultProps,
      shouldSelectOnPressUp: true
    },
    state,
    ref
  );

  const dropState = useDroppableCollectionState({
    ...defaultProps,
    collection: state.collection,
    selectionManager: state.selectionManager
  });

  const { collectionProps } = useDroppableCollection(
    {
      ...defaultProps,
      keyboardDelegate: new ListKeyboardDelegate(
        state.collection,
        state.disabledKeys,
        ref
      ),
      dropTargetDelegate: new ListDropTargetDelegate(state.collection, ref)
    },
    dropState,
    ref
  );

  // Setup drag state for the collection.
  const dragState = useDraggableCollectionState({
    ...defaultProps,
    // Collection and selection manager come from list state.
    collection: state.collection,
    selectionManager: state.selectionManager,
    // Provide data for each dragged item. This function could
    // also be provided by the user of the component.
    getItems: defaultProps.getItems || ((keys) => {
      return [...keys].map((key) => {
        const item = state.collection.getItem(key);

        if (item === null) return

        return {
          'text/plain': item.textValue
        };
      });
    })
  });

  useDraggableCollection(defaultProps, dragState, ref);

  return (
    <div className={className}>
      <h2 className='reordable-list-title'>
        {label}
      </h2>

      <div className='reordable-lsit-wrapper'>
        {/* <div className='reordable-list-indexes'>
          {[...state.collection].map((item, i) => (
            <div key={i}> {i + 1 + "°"} </div>
          ))}
        </div> */}

        <ul
          {...mergeProps(listBoxProps, collectionProps)}
          ref={ref}
          className='reordable-list'
        >
          {[...state.collection].map((item) => (
            <ReorderableOption
              key={item.key}
              item={item}
              state={state}
              dragState={dragState}
              dropState={dropState}
              isDisabled={isDisabled}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
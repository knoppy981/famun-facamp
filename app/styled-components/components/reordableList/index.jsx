import { useDroppableCollectionState, useDraggableCollectionState, useListState } from 'react-stately';
import { ListDropTargetDelegate, ListKeyboardDelegate, mergeProps, useDroppableCollection, useListBox, useDraggableCollection } from 'react-aria';

import { ReorderableOption } from './option';
import * as S from "./elements"

export { Item, Section } from "react-stately";

export const ReorderableListBox = (props) => {
  // See useListBox docs for more details.
  let state = useListState(props);
  let ref = React.useRef(null);
  let { listBoxProps } = useListBox(
    {
      ...props,
      shouldSelectOnPressUp: true
    },
    state,
    ref
  );

  let dropState = useDroppableCollectionState({
    ...props,
    collection: state.collection,
    selectionManager: state.selectionManager
  });

  let { collectionProps } = useDroppableCollection(
    {
      ...props,
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
  let dragState = useDraggableCollectionState({
    ...props,
    // Collection and selection manager come from list state.
    collection: state.collection,
    selectionManager: state.selectionManager,
    // Provide data for each dragged item. This function could
    // also be provided by the user of the component.
    getItems: props.getItems || ((keys) => {
      return [...keys].map((key) => {
        let item = state.collection.getItem(key);

        return {
          'text/plain': item.textValue
        };
      });
    })
  });

  useDraggableCollection(props, dragState, ref);

  return (
    <S.List
      style={{pointerEvents: props.isDisabled ? "none" : "auto"}}
      {...mergeProps(listBoxProps, collectionProps)}
      ref={ref}
    >
      {[...state.collection].map((item) => (
        <ReorderableOption
          key={item.key}
          item={item}
          state={state}
          dragState={dragState}
          dropState={dropState}
          isDisabled={props.isDisabled}
        />
      ))}
    </S.List>
  );
}
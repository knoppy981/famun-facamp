import React, { forwardRef } from 'react';
import type { AriaListBoxProps, AriaOptionProps } from 'react-aria';
import { Item, ListState, useListState } from 'react-stately';
import {
  mergeProps,
  useFocusRing,
  useListBox,
  useOption,
  useListBoxSection,
} from 'react-aria';

import { mergeRefs } from '~/lib/merge-refs';

const ListBox = forwardRef<HTMLUListElement, any>((props, forwardedRef) => {
  const ref = React.useRef(null);
  const { state } = props;
  const { listBoxProps, labelProps } =
    useListBox(props, state, ref);

  return (
    <>
      <div {...labelProps}>{props.label}</div>
      <ul
        {...listBoxProps}
        ref={mergeRefs([ref, forwardedRef])}
        className='list-box'
      >
        {[...state.collection].map((item) => (
          item.type === 'section' ?
            <ListBoxSection
              key={item.key}
              section={item}
              state={state}
            /> :
            <Option
              key={item.key}
              item={item}
              state={state}
            />
        ))}
      </ul>
    </>
  );
})

const Option = ({ item, state }: { item: any; state: ListState<any> }) => {
  const ref = React.useRef(null);
  const { optionProps, isSelected, isFocused, isDisabled } = useOption(
    { key: item.key },
    state,
    ref
  );

  const { isFocusVisible, focusProps } = useFocusRing();

  return (
    <li
      {...mergeProps(optionProps, focusProps)}
      ref={ref}
      /* data-focus-visible={isFocusVisible} */
      className={`list-box-item ${isFocused ? "focused" : ""} ${isSelected ? "selected" : ""}`}
    >
      {item.rendered}
    </li>
  );
}

const ListBoxSection = ({ section, state }: { section: any; state: ListState<any> }) => {
  const { itemProps, headingProps, groupProps } =
    useListBoxSection({
      heading: section.rendered,
      'aria-label': section['aria-label']
    });

  // If the section is not the first, add a separator element to provide visual separation.
  // The heading is rendered inside an <li> element, which contains
  // a <ul> with the child items.
  return (
    <>
      {section.key !== state.collection.getFirstKey() &&
        (
          <li
            role="presentation"
            style={{
              borderTop: '1px solid gray',
              margin: '2px 5px'
            }}
          />
        )}
      <li {...itemProps}>
        {section.rendered &&
          (
            <span
              {...headingProps}
              style={{
                fontWeight: 'bold',
                fontSize: '1.1em',
                padding: '2px 5px'
              }}
            >
              {section.rendered}
            </span>
          )}
        <ul
          {...groupProps}
          style={{
            padding: 0,
            listStyle: 'none'
          }}
        >
          {[...section.childNodes].map((node) => (
            <Option
              key={node.key}
              item={node}
              state={state}
            />
          ))}
        </ul>
      </li>
    </>
  );
}

export default ListBox
import React, { forwardRef } from 'react';
import type { AriaListBoxProps, AriaOptionProps } from 'react-aria';
import { Item, ListState, useListState } from 'react-stately';
import {
  mergeProps,
  useFocusRing,
  useListBox,
  useOption,
  useListBoxSection,
  useHover,
} from 'react-aria';
import { FiX } from 'react-icons/fi/index.js'

import { mergeRefs } from '~/lib/merge-refs';
import TextField from './textfield';
import Button from './button';
import useDidMountEffect from '~/hooks/useDidMountEffect';

export { Item, Section } from "react-stately";

const PopItemsList = forwardRef<HTMLUListElement, any>((props, forwardedRef) => {
  const [list, setList] = React.useState<{ id: string }[]>(props.items)
  const [inputValue, setInputValue] = React.useState("")
  const removeItemById = (id: string) => {
    if (props.isDisabled) return
    setList((currentItems) => {
      const newItems = currentItems.filter(item => item.id !== id)
      props.onSelectionChange(newItems)
      return newItems
    });
  };
  const addItemById = () => {
    if (props.isDisabled || inputValue === undefined || inputValue === "") return
    setList((currentItems) => {
      const newItems = [...currentItems, { id: inputValue }]
      props.onSelectionChange(newItems)
      return newItems
    });
    setInputValue("")
  };
  const handleChange = (e: any) => setInputValue(e.target.value)

  return (
    <div className='pop-list-box-wrapper'>
      <div className='label text'>{props.label}</div>
      <ul
        ref={forwardedRef}
        className={`pop-list-box ${props.isDisabled ? "disabled" : ""}`}
      >
        {list.map((item: any) => (
          <Option
            key={item.id}
            item={item}
            removeItemById={removeItemById}
            isDisabled={props.isDisabled}
          />
        ))}
      </ul>

      {!props.isDisabled ?
        <div className='pop-list-input-wrapper'>
          <TextField
            className="pop-list-box-input"
            name="conference"
            aria-label="Adicionar"
            type="text"
            isRequired
            placeholder='Nome da conferência - Idioma'
            onChange={handleChange}
            value={inputValue}
          />

          <Button onPress={addItemById}>
            Adicionar
          </Button>
        </div>
        : null
      }
    </div>
  );
})

const Option = ({ item, removeItemById, isDisabled }: { item: any; removeItemById: (id: string) => void, isDisabled: boolean }) => {
  const ref = React.useRef(null);

  return (
    <li
      ref={ref}
      className={`pop-list-box-item ${isDisabled ? "disabled" : ""}`}
      onClick={() => !isDisabled ? removeItemById(item.id) : null}
      key={item.id}
    >
      {!isDisabled ? <FiX className='icon' /> : null}
      {item.id}
    </li>
  );
}

export default PopItemsList
import React from "react";
import { Item, ReorderableListBox } from "~/components/reordableList";

const CouncilPreference = (props: any) => {
  const { defaultValues, isDisabled, handleChange, error } = props

  const [arr, setArr] = React.useState(defaultValues?.delegate?.councilPreference.map((item: string) => ({ id: item })))

  const onReorder = (e: any) => {
    if (isDisabled) return
    setArr((prevValue: any) => {
      const array = prevValue.map((item: any) => item.id)

      let key = [...e.keys][0]

      const keyIndex = array.indexOf(key);
      const targetIndex = array.indexOf(e.target.key);

      array.splice(keyIndex, 1);
      if (e.target.dropPosition === 'before') {
        array.splice(targetIndex, 0, key);
      } else if (e.target.dropPosition === 'after') {
        array.splice(targetIndex + 1, 0, key);
      }
      handleChange({ target: { name: "delegate.councilPreference", value: array } })

      return array.map((item: string) => ({ id: item }))
    })
  };

  return (
    <div className={`data-box-container ${error ? "error" : ""}`}>
      <h3 className="data-box-container-title blue-border">
        Comitê/Conselho que pode simular
      </h3>

      {defaultValues?.delegate?.councilPreference ?
        <ReorderableListBox
          aria-label="Preferencia de conselho"
          selectionMode="multiple"
          selectionBehavior="replace"
          items={arr}
          onReorder={onReorder}
          isDisabled={isDisabled}
        >
          {(item: { id: string }) => <Item>{item.id.replace(/_/g, " ")}</Item>}
        </ReorderableListBox> :
        null
      }

      <div className='data-box-border' />
    </div>
  )
}

export default CouncilPreference
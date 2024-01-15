import { Item, ReorderableListBox } from "~/components/reordableList";

const CouncilPreference = (props: any) => {
  const { formData, isDisabled, handleChange, error } = props

  const onReorder = (e: any) => {
    if (isDisabled) return
    const array = formData?.delegate?.councilPreference

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
  };

  return (
    <div className={`data-box-container ${error ? "error" : ""}`}>
      <h3 className="data-box-container-title blue-border">
        Comitê/Conselho que pode simular
      </h3>

      {formData?.delegate?.councilPreference &&
        <ReorderableListBox
          aria-label="Preferencia de conselho"
          selectionMode="multiple"
          selectionBehavior="replace"
          items={formData?.delegate?.councilPreference?.map((item: string) => ({ id: item }))}
          onReorder={onReorder}
          isDisabled={isDisabled}
        >
          {(item: { id: string }) => <Item>{item.id.replace(/_/g, " ")}</Item>}
        </ReorderableListBox>
      }

      <div className='data-box-border' />
    </div>
  )
}

export default CouncilPreference
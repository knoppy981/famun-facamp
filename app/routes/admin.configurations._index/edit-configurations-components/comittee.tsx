import React from "react"
import PopItemsList, { Item } from "~/components/popItemsList"

const ComitteeConfigurations = (props: any) => {
  const { defaultValues, isDisabled, handleChange, actionData, theme } = props

  let emoptions = defaultValues.conselhosEscolas.map((item: any) => ({ id: item }))
  let unioptions = defaultValues.conselhosUniversidades.map((item: any) => ({ id: item }))

  return (
    <div className={`data-box-container ${theme ?? ""}`} style={{ placeSelf: "auto", alignSelf: "normal" }}>
      <h3 className="data-box-container-title blue-border">
        Designação de Comitês
      </h3>

      <div className='data-box-secondary-input-container'>
        <PopItemsList
          label="Ensino Médio"
          items={emoptions}
          selectionMode="single"
          onSelectionChange={(e: any) => handleChange({ target: { name: "conselhosEscolas", value: e.map((item: any) => item.id) } })}
          isDisabled={isDisabled}
        >
          {(item: any) => <Item>{item.id}</Item>}
        </PopItemsList>

        <PopItemsList
          label="Universidade"
          items={unioptions}
          selectionMode="single"
          onSelectionChange={(e: any) => handleChange({ target: { name: "conselhosUniversidades", value: e.map((item: any) => item.id) } })}
          isDisabled={isDisabled}
        >
          {(item: any) => <Item>{item.id}</Item>}
        </PopItemsList>
      </div>

      <div className='data-box-border' />
    </div>
  )
}

export default ComitteeConfigurations
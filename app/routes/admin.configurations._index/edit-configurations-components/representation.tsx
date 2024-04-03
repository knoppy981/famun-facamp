import React from "react"
import PopItemsList, { Item } from "~/components/popItemsList"

const RepresentationConfiguration = (props: any) => {
  const { defaultValues, isDisabled, handleChange, actionData, theme } = props

  let options = defaultValues.representacoesExtras?.map((item: any) => ({ id: item }))

  return (
    <div className={`data-box-container ${theme ?? ""}`} style={{ placeSelf: "auto", alignSelf: "normal" }}>
      <h3 className="data-box-container-title blue-border">
        Represenações Adicionais
      </h3>

      <div className='data-box-secondary-input-container'>
        <PopItemsList
          label="Representações"
          placeholder="Representação"
          items={options}
          selectionMode="single"
          onSelectionChange={(e: any) => handleChange({ target: { name: "representacoesExtras", value: e.map((item: any) => item.id) } })}
          isDisabled={isDisabled}
        >
          {(item: any) => <Item>{item.id}</Item>}
        </PopItemsList>
      </div>

      <div className='data-box-border' />
    </div>
  )
}

export default RepresentationConfiguration
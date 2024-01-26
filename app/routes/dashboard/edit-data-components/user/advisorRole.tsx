import { Item, Select } from "~/components/select"
import { action } from "~/routes/api.delegationCode"

const AdvisorRoleData = (props: any) => {
  const { formData, isDisabled, handleChange, actionData, error } = props

  return (
    <div className={`data-box-container ${error ? "error" : ""}`}>
      <h3 className="data-box-container-title blue-border">
        Posição do orientador
      </h3>

      <Select
        className="secondary-input-box"
        name="advisorRole"
        aria-label="Posição do(a) Professor(a) Orientador(a)"
        defaultSelectedKey={formData?.delegationAdvisor?.advisorRole}
        onSelectionChange={value => handleChange({ target: { name: "delegationAdvisor.advisorRole", value: value } })}
        isDisabled={isDisabled}
        hideLabel={true}
        items={[
          { id: "Professor" },
          { id: "Coordenador" },
          { id: "Diretor" },
          { id: "Outro" }
        ]}
        errorMessage={actionData?.errors?.advisorRole}
        action={actionData}
        onChangeUpdateError={formData}
      >
        {(item) => <Item>{`${item.id}${item.id !== "Outro" ? "(a)" : ""}`}</Item>}
      </Select>

      <div className='data-box-border' />
    </div>
  )
}

export default AdvisorRoleData
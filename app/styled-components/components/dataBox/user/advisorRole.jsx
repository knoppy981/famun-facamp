import * as S from "../elements"

import { Select, Item } from '~/styled-components/components/select';
import DataChangeInputBox from '~/styled-components/components/inputBox/dataChange'

const AdvisorRoleData = (props) => {

  const { formData, isDisabled, handleChange, actionData } = props

  return (
    <S.Container>
      <S.ContainerTitle border="blue">
        Posição do orientador
      </S.ContainerTitle>
      
      <DataChangeInputBox>
        <Select
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
          err={actionData?.errors?.name}
        >
          {(item) => <Item>{`${item.id}${item.id !== "Outro" ? "(a)" : ""}`}</Item>}
        </Select>
      </DataChangeInputBox>
    </S.Container>
  )
}

export default AdvisorRoleData
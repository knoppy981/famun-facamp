import { Select, Item } from "~/components/select";
import TextField from "~/components/textfield";

const AdvisorData = ({ data, actionData }: { data: any; actionData: any }) => {
  return (
    <>
      <h1 className='join-title'>
        Dados do(a) Professor(a) Orientador(a)
      </h1>

      <div className="join-container">
        <div className="join-input-container">
          <Select
            className="primary-input-box"
            name="advisorRole"
            label="Posição do(a) Professor(a) Orientador(a)"
            defaultSelectedKey={data?.advisorRole ?? "Professor"}
            items={[
              { id: "Professor" },
              { id: "Coordenador" },
              { id: "Diretor" },
              { id: "Outro" }
            ]}
            errorMessage={actionData?.errors?.advisorRole}
            action={actionData}
          >
            {(item) => <Item>{`${item.id}${item.id !== "Outro" ? "(a)" : ""}`}</Item>}
          </Select>

          <TextField
            className="primary-input-box"
            name="instagram"
            label="Instagram"
            type="text"
            defaultValue={data?.instagram}
            errorMessage={actionData?.errors?.instagram}
            action={actionData}
          />

          <TextField
            className="primary-input-box"
            name="facebook"
            label="Facebook"
            type="text"
            defaultValue={data?.facebook}
            errorMessage={actionData?.errors?.facebook}
            action={actionData}
          />

          <TextField
            className="primary-input-box"
            name="linkedin"
            label="Linkedin"
            type="text"
            defaultValue={data?.linkedin}
            errorMessage={actionData?.errors?.linkedin}
            action={actionData}
          />

          <input type='hidden' name="userType" value="advisor" />
        </div>
      </div>
    </>
  )
}

export default AdvisorData
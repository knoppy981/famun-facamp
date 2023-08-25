import * as S from './elements'
import DefaultInputBox from '~/styled-components/components/inputBox/default';
import TextField from '~/styled-components/components/textField';
import { Select, Item } from '~/styled-components/components/select';

const AdvisorData = ({ data, actionData }) => {
  return (
    <>
      <S.Title>
        Dados do(a) Professor(a) Orientador(a)
      </S.Title>

      <S.Wrapper>
        <S.InputContainer>
          <DefaultInputBox>
            <Select
              name="advisorRole"
              label="Posição do(a) Professor(a) Orientador(a)"
              defaultSelectedKey={data?.role}
              items={[
                { id: "Professor" },
                { id: "Coordenador" },
                { id: "Diretor" },
                { id: "Outro" }
              ]}
              err={actionData?.errors?.role}
            >
              {(item) => <Item>{`${item.id}${item.id !== "Outro" ? "(a)" : ""}`}</Item>}
            </Select>
          </DefaultInputBox>

          <DefaultInputBox>
            <TextField
              name="instagram"
              label="Instagram"
              type="text"
              defaultValue={data?.instagram}
              err={actionData?.errors?.instagram}
              action={actionData}
            />
          </DefaultInputBox>

          <DefaultInputBox>
            <TextField
              name="facebook"
              label="Facebook"
              type="text"
              defaultValue={data?.facebook}
              err={actionData?.errors?.facebook}
              action={actionData}
            />
          </DefaultInputBox>

          <DefaultInputBox>
            <TextField
              name="linkedin"
              label="Linkedin"
              type="text"
              defaultValue={data?.linkedin}
              err={actionData?.errors?.linkedin}
              action={actionData}
            />
          </DefaultInputBox>

          <input type='hidden' name="userType" value="advisor" />
        </S.InputContainer>
      </S.Wrapper>
    </>
  )
}

export default AdvisorData
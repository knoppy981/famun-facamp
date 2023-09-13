import qs from 'qs'
import { useListData } from 'react-stately';

import * as S from './elements'
import { FiAlertTriangle } from 'react-icons/fi'
import DefaultInputBox from '~/styled-components/components/inputBox/default';
import TextField from '~/styled-components/components/textField';
import PhoneNumberField from '~/styled-components/components/textField/phoneNumber'
import { ReorderableListBox, Item } from '~/styled-components/components/reordableList';
import { CheckboxGroup, Checkbox } from '~/styled-components/components/checkbox/checkboxGroup';

const DelegateData = ({ data, actionData }) => {
  const list = useListData({
    initialItems: data.councilPreference ?
      Object.values(qs.parse(data.councilPreference)).map(item => ({ id: item })) :
      [
        { id: 'Assembleia_Geral_da_ONU' },
        { id: 'Rio_92' },
        { id: 'Conselho_de_Juventude_da_ONU' },
        { id: 'Conselho_de_Seguranca_da_ONU' },
      ]
  });

  const onReorder = (e) => {
    if (e.target.dropPosition === 'before') {
      list.moveBefore(e.target.key, e.keys);
    } else if (e.target.dropPosition === 'after') {
      list.moveAfter(e.target.key, e.keys);
    }
  };

  return (
    <>
      <S.Title>
        Informações do Delegado
      </S.Title>

      <S.Wrapper>
        <S.Container>
          <S.ContainerTitle err={actionData?.errors.council}>
            Coloque em ordem crescente quais Comitês / Conselhos você deseja simular em ordem de preferência.
            Atenção aos idiomas de cada simulação
          </S.ContainerTitle>

          <S.ReorderableListWrapper>
            <S.ReordableListIndexes>
              {[1, 2, 3, 4].map((i) => (
                <div key={i}> {i}- </div>
              ))}
            </S.ReordableListIndexes>

            <S.ReorderableListContainer>
              <ReorderableListBox
                aria-label="Favorite animals"
                selectionMode="multiple"
                selectionBehavior="replace"
                items={list.items}
                onReorder={onReorder}
              >
                {(item) => <Item>{item.id.replace(/_/g, " ")}</Item>}
              </ReorderableListBox>
            </S.ReorderableListContainer>

            <input type="hidden" name="councilPreference" value={qs.stringify(list.items.map(item => item.id))} />
          </S.ReorderableListWrapper>
        </S.Container>

        <S.Container>
          <CheckboxGroup
            label="Idiomas que pode simular"
            name="languagesSimulates"
            defaultValue={data.languagesSimulates}
            err={actionData?.errors.languagesSimulates}
            action={actionData}
          >
            <Checkbox value="Portugues">Português</Checkbox>
            <Checkbox value="Ingles">Inglês</Checkbox>
            <Checkbox value="Espanhol">Espanhol</Checkbox>
          </CheckboxGroup>
        </S.Container>

        <S.Container>
          <S.ContainerTitle>
            Contato de Emergência
          </S.ContainerTitle>

          <DefaultInputBox>
            <TextField
              name="emergencyContactName"
              label="Nome"
              type="text"
              defaultValue={data?.emergencyContactName}
              err={actionData?.errors?.emergencyContactName}
              action={actionData}
            />
          </DefaultInputBox>

          <DefaultInputBox>
            <PhoneNumberField
              name="emergencyContactPhoneNumber"
              label="Número para Contato"
              type="text"
              _defaultValue={data?.emergencyContactPhoneNumber}
              err={actionData?.errors?.emergencyContactPhoneNumber}
              action={actionData}
            />
          </DefaultInputBox>

          <input type='hidden' name="userType" value="delegate" />
        </S.Container>
      </S.Wrapper>
    </>
  )
}

export default DelegateData
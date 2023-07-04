import { useEffect, useState } from 'react'
import qs from 'qs'

import * as S from './elements'
import { FiAlertTriangle } from 'react-icons/fi'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import DefaultInputBox from '~/styled-components/components/inputs/defaultInput'
import PhoneInputBox from '~/styled-components/components/inputs/defaultInput/phoneInput'

const initialItems = ['Assembleia Geral da ONU', 'Rio 92', 'Conselho de Juventude da ONU', 'Conselho de Seguranca da ONU'];

const DelegateData = ({ data, actionData }) => {

  const [items, setItems] = useState(initialItems);

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const newItems = [...items];
    const [removed] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, removed);

    setItems(newItems);
  };

  return (
    <>
      <S.Title>
        Informações do Delegado
      </S.Title>

      <S.Wrapper>
        <S.Container>
          <S.ContainerTitle err={actionData?.errors.council}>
            {actionData?.errors.council ? <><FiAlertTriangle /> {actionData?.errors.council} </> : <>Indique quais Comitês/Conselhos você deseja simular em ordem de preferência. Atenção aos idiomas de cada simulação <b>Obs: Arraste os items para trocar a ordem</b></>}
          </S.ContainerTitle>

          <S.DragDropContainer>
            <S.DragDropIndexes>
              {items.map((item, index) => (
                <div key={`dropdown-index-${index}`}>
                  {index + 1}.
                </div>
              ))}
            </S.DragDropIndexes>

            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="list">
                {(provided) => (
                  <ul {...provided.droppableProps} ref={provided.innerRef}>
                    {items.map((item, index) => (
                      <Draggable key={item} draggableId={item} index={index}>
                        {(provided, snapshot) => (
                          <S.ListItemContainer
                            first={index === 0}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                          >
                            <S.ListItem
                              first={index === 0}
                              {...provided.dragHandleProps}
                            >
                              {item}
                            </S.ListItem>
                          </S.ListItemContainer>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
          </S.DragDropContainer>

          <input type="hidden" name="council" value={qs.stringify(items)} />
        </S.Container>

        <S.Container>
          <S.ContainerTitle err={actionData?.errors.language}>
            {actionData?.errors.language ? <> {actionData?.errors.language} </> : 'Idiomas que pode simular'}
          </S.ContainerTitle>

          <S.CheckBoxWrapper>
            {["Portugues", "Ingles", "Espanhol"].map((item, index) => (
              <S.CheckBoxContainer key={`language-checkbox-${index}`}>
                <S.CheckBox
                  id={item}
                  name="language"
                  value={item}
                  defaultChecked={data?.language?.includes(
                    `${item}`
                  )}
                  type="checkbox"
                />

                <S.LabelContainer>
                  <S.Label htmlFor={item}>
                    {item[0] === 'P' ? 'Português' : item[0] === 'I' ? 'Inglês' : item}
                  </S.Label>
                </S.LabelContainer>
              </S.CheckBoxContainer>
            ))}
          </S.CheckBoxWrapper>
        </S.Container>

        <S.Container>
          <S.ContainerTitle>
            Contato de Emergência
          </S.ContainerTitle>

          <DefaultInputBox
            name="emergencyContactName"
            text="Nome"
            type="text"
            value={data?.emergencyContactName}
            err={actionData?.errors?.emergencyContactName}
          />

          <PhoneInputBox
            name="emergencyContactPhoneNumber"
            text="Número para Contato"
            type="text"
            value={data?.emergencyContactPhoneNumber}
            err={actionData?.errors?.emergencyContactPhoneNumber}
          />
        </S.Container>
      </S.Wrapper>
    </>
  )
}

export default DelegateData
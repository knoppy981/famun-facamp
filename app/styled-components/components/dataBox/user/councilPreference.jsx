import { ReorderableListBox, Item } from '~/styled-components/components/reordableList';

import * as S from "../elements"

const CouncilPreference = (props) => {

  const { formData, isDisabled, handleChange } = props

  const transformArray = (arr) => {
    return arr?.map(item => ({ id: item}));
  }

  const onReorder = (e) => {
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
    <S.Container>
      <S.ContainerTitle border="blue">
        Preferencia de Conselho
      </S.ContainerTitle>

      <S.ReorderableListWrapper key={formData?.id}>
        <S.ReordableListIndexes>
          {[1, 2, 3, 4].map((i) => (
            <div key={i}> {i}- </div>
          ))}
        </S.ReordableListIndexes>

        <S.ReorderableListContainer>
          {formData?.delegate?.councilPreference && <ReorderableListBox
            aria-label="Favorite animals"
            selectionMode="multiple"
            selectionBehavior="replace"
            items={formData?.delegate?.councilPreference?.map(item => ({ id: item}))}
            onReorder={onReorder}
            isDisabled={isDisabled}
          >
            {(item) => <Item>{item.id?.replace(/_/g, ' ')}</Item>}
          </ReorderableListBox>}
        </S.ReorderableListContainer>
      </S.ReorderableListWrapper>
    </S.Container>
  )
}

export default CouncilPreference
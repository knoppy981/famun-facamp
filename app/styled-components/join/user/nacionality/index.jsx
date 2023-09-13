import { useState } from 'react'
import { useFilter } from 'react-aria'

import * as S from './elements'
import { isoCountries } from '~/data/ISO-3661-1'
import DefaultInputBox from '~/styled-components/components/inputBox/default'
import { ComboBox, Item } from '~/styled-components/components/comboBox'

const Nacionality = ({ data, actionData }) => {
  function createCountryArray(countries) {
    return Object.keys(countries).map(countryName => {
      return {
        id: countryName
      };
    });
  }

  const countryArray = createCountryArray(isoCountries)

  let [country, setCountry] = useState();

  let [fieldState, setFieldState] = React.useState({
    selectedKey: data.nacionality ?? "Brazil",
    inputValue: data.nacionality ?? "Brazil",
    items: countryArray
  });

  // Implement custom filtering logic and control what items are
  // available to the ComboBox.
  let { startsWith } = useFilter({ sensitivity: 'base' });

  // Specify how each of the ComboBox values should change when an
  // option is selected from the list box
  let onSelectionChange = (key) => {
    setFieldState((prevState) => {
      let selectedItem = prevState.items.find((option) => option.id === key);
      return ({
        inputValue: selectedItem?.id ?? '',
        selectedKey: key,
        items: countryArray.filter((item) =>
          startsWith(item.id, selectedItem?.id ?? '')
        )
      });
    });
  };

  // Specify how each of the ComboBox values should change when the input
  // field is altered by the user
  let onInputChange = (value) => {
    setFieldState((prevState) => ({
      inputValue: value,
      selectedKey: value === '' ? null : prevState.selectedKey,
      items: countryArray.filter((item) => startsWith(item.id, value))
    }));
  };

  // Show entire list if user opens the menu manually
  let onOpenChange = (isOpen, menuTrigger) => {
    if (menuTrigger === 'manual' && isOpen) {
      setFieldState((prevState) => ({
        inputValue: prevState.inputValue,
        selectedKey: prevState.selectedKey,
        items: countryArray
      }));
    }
  };

  return (
    <>
      <S.Title>
        Nacionalidade
      </S.Title>

      <S.Wrapper>
        <DefaultInputBox>
          <ComboBox
            name="nacionality"
            label="País de Nascimento"
            items={fieldState.items}
            selectedKey={fieldState.selectedKey}
            inputValue={fieldState.inputValue}
            onOpenChange={onOpenChange}
            onSelectionChange={onSelectionChange}
            onInputChange={onInputChange}
            err={actionData?.errors?.nacionality}
            action={actionData}
            leftItem={<S.NacionalityFlag className={`flag-icon flag-icon-${isoCountries[fieldState.selectedKey]?.toLowerCase()}`} />}
          >
            {(item) => <Item>{item.id}</Item>}
          </ComboBox>
        </DefaultInputBox>
      </S.Wrapper>
    </>
  )
}

export default Nacionality
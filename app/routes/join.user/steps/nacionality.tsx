import React, { useState } from 'react'
import { MenuTriggerAria, useFilter } from 'react-aria'
import ComboBox, { Item } from '~/components/combobox'

import { isoCountries } from '~/lib/ISO-3661-1';


const Nacionality = ({ data, actionData }: { data: any; actionData: any }) => {
  function createCountryArray(countries: object) {
    return Object.keys(countries).map(countryName => {
      return {
        id: countryName
      };
    });
  }

  const countryArray = createCountryArray(isoCountries)

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
  let onSelectionChange = (key: React.Key) => {
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
  let onInputChange = (value: string) => {
    setFieldState((prevState) => ({
      inputValue: value,
      selectedKey: value === '' ? null : prevState.selectedKey,
      items: countryArray.filter((item) => startsWith(item.id, value))
    }));
  };

  // Show entire list if user opens the menu manually
  let onOpenChange = (isOpen: boolean, menuTrigger?: any) => {
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
      <h2 className='join-title'>
        Nacionalidade
      </h2>

      <div>
        <ComboBox
          className='primary-input-box'
          name="nacionality"
          label="País de Nascimento"
          items={fieldState.items}
          selectedKey={fieldState.selectedKey}
          inputValue={fieldState.inputValue}
          onOpenChange={onOpenChange}
          errorMessage={actionData?.errors?.nacionality}
          action={actionData}
          onSelectionChange={onSelectionChange}
          onInputChange={onInputChange}
          leftItem={fieldState.selectedKey && <div className={`join-nacionality-flag flag-icon flag-icon-${isoCountries[fieldState.selectedKey]?.toLowerCase()}`} />}
        >
          {(item) => <Item>{item.id}</Item>}
        </ComboBox>
      </div>
    </>
  )
}

export default Nacionality
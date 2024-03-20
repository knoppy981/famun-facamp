import React, { Key } from 'react'
import { AnimatePresence } from 'framer-motion'
import qs from 'qs'
import { OverlayTriggerState } from 'react-stately'

import Modal from '~/components/modalOverlay'
import Button from '~/components/button';
import Dialog from '~/components/dialog'
import { FiX } from "react-icons/fi/index.js";
import ComboBox, { Item } from '~/components/combobox'
import { FetcherWithComponents, useFetcher } from '@remix-run/react'
import { ComitteeType } from './route'
import { useFilter } from 'react-aria'

const RemoveParticipant = ({ state, comittee }: { state: OverlayTriggerState, comittee: ComitteeType }) => {
  const fetcher = useFetcher<any>()
  const delegates = comittee.delegates.map(delegate => ({ id: delegate.id, name: delegate.user.name }))
  const [selectedDelegates, handleDelegateSelection, clearSelectedDelegates, handleSubmission] = useRemoveParticipant(fetcher, state, comittee)
  const [fieldState, onSelectionChange, onInputChange, onOpenChange] = useComboBox(delegates, handleDelegateSelection)

  return (
    <AnimatePresence>
      {state.isOpen &&
        <Modal state={state} isDismissable>
          <Dialog>
            <div className="admin-dialog-title">
              <h2>
                Remover delegados
              </h2>

              <Button onPress={state.close}>
                <FiX className='icon' />
              </Button>
            </div>

            <ComboBox
              className='primary-input-box'
              name="user-search"
              label="Procurar delegados"
              items={fieldState.items}
              selectedKey={fieldState.selectedKey}
              inputValue={fieldState.inputValue}
              onOpenChange={onOpenChange}
              action={null}
              onSelectionChange={onSelectionChange}
              onInputChange={onInputChange}
              theme="dark"
            >
              {(item) => <Item textValue={item.name}>{item.name}</Item>}
            </ComboBox>

            {selectedDelegates.length > 0 ?
              <>
                <div className='comittee-selected-delegates'>
                  Delegados a serem excluídos: {selectedDelegates.map((item, index) => <span key={index}>{index !== 0 ? ", " : ""} {item.name}</span>)}
                </div>

                <Button className='text italic' onPress={clearSelectedDelegates}>
                  Limpar
                </Button>
              </> : null
            }

            <Button type='submit' className='comittee-add-form-button' isDisabled={selectedDelegates.length === 0 || fetcher.state !== "idle"} onPress={handleSubmission}>
              {fetcher.state !== "idle" ? "Removendo" : "Remover"}
            </Button>
          </Dialog>
        </Modal>
      }
    </AnimatePresence >
  )
}

function useRemoveParticipant(fetcher: FetcherWithComponents<any>, state: OverlayTriggerState, comittee: ComitteeType): [
  { id: string; name: string }[], (delegate: { id: string; name: string }) => void, () => void, () => void
] {
  const [selectedDelegates, setSelectedDelegates] = React.useState<{ id: string; name: string }[]>([])

  const handleSubmission = () => {
    fetcher.submit(
      qs.stringify({ ids: selectedDelegates.map(item => item.id), comitteeId: comittee.id, actionType: "remove" }),
      { method: "POST" }
    )
  }

  const handleDelegateSelection = (delegate: { id: string, name: string }) => {
    if (delegate === undefined) return

    setSelectedDelegates((prevSelectedDelegates) => {
      const isAlreadySelected = prevSelectedDelegates.some((d) => d.id === delegate.id);

      if (isAlreadySelected) {
        return prevSelectedDelegates.filter((d) => d.id !== delegate.id);
      } else {
        return [...prevSelectedDelegates, delegate];
      }
    });
  }

  const clearSelectedDelegates = () => setSelectedDelegates([])

  React.useEffect(() => {
    if (fetcher.data?.comittee) {
      clearSelectedDelegates()
      state.close()
    }
  }, [fetcher.data])

  React.useEffect(() => {
    clearSelectedDelegates()
  }, [state.isOpen])

  return [selectedDelegates, handleDelegateSelection, clearSelectedDelegates, handleSubmission]
}

function useComboBox(delegatesList: any, handleDelegateSelection: (delegate: { id: string; name: string }) => void): [
  { selectedKey: any; inputValue: string; items: any; }, (key: React.Key) => void, (value: string) => void, (isOpen: boolean, menuTrigger?: any) => void
] {
  let [fieldState, setFieldState] = React.useState({
    selectedKey: "" as any,
    inputValue: "" as string,
    items: delegatesList
  });

  // Implement custom filtering logic and control what items are
  // available to the ComboBox.
  let { startsWith } = useFilter({ sensitivity: 'base' });

  // Specify how each of the ComboBox values should change when an
  // option is selected from the list box
  let onSelectionChange = (key: React.Key) => {
    setFieldState((prevState) => {
      let selectedItem = prevState.items.find((option: any) => option.id === key);
      handleDelegateSelection(selectedItem)
      return ({
        inputValue: "",
        selectedKey: "",
        items: []
      });
    });
  };

  // Specify how each of the ComboBox values should change when the input
  // field is altered by the user
  let onInputChange = (value: string) => {
    setFieldState((prevState) => ({
      inputValue: value,
      selectedKey: value === '' ? null : prevState.selectedKey,
      items: delegatesList.filter((item: any) => startsWith(item.name, value))
    }));
  };

  // Show entire list if user opens the menu manually
  let onOpenChange = (isOpen: boolean, menuTrigger?: any) => {
    if (menuTrigger === 'manual' && isOpen) {
      setFieldState((prevState) => ({
        inputValue: prevState.inputValue,
        selectedKey: prevState.selectedKey,
        items: delegatesList
      }));
    }
  };

  return [fieldState, onSelectionChange, onInputChange, onOpenChange]
}

export default RemoveParticipant

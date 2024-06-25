import React from 'react'
import { FetcherWithComponents, useFetcher, useNavigate } from '@remix-run/react';
import { ParticipationMethod } from '@prisma/client'
import qs from 'qs'
import { AnimatePresence } from 'framer-motion'
import { useFilter } from 'react-aria';
import { OverlayTriggerState } from 'react-stately'

import Button from '~/components/button';
import ComboBox, { Item } from '~/components/combobox'
import Modal from '~/components/modalOverlay'
import Dialog from '~/components/dialog'
import { FiX } from "react-icons/fi/index.js";
import { CommitteeType } from './route';

const AddParticipant = ({ state, committee, participationMethod }: { state: OverlayTriggerState, committee: CommitteeType, participationMethod: ParticipationMethod }) => {
  const fetcher = useFetcher<any>()
  const [delegatesList, selectedDelegates, handleDelegateSelection, clearSelectedDelegates, handleSubmission] = useAddParticipant(fetcher, committee, state, participationMethod)
  const [fieldState, onSelectionChange, onInputChange, onOpenChange] = useComboBox(delegatesList, handleDelegateSelection)

  return (
    <AnimatePresence>
      {state.isOpen &&
        <Modal state={state} isDismissable>
          <Dialog>
            <div className="admin-dialog-title">
              <h2>
                Adicionar Delegados
              </h2>

              <Button onPress={state.close}>
                <FiX className='icon' />
              </Button>
            </div>

            <ComboBox
              className='primary-input-box'
              name="user-search"
              label="Procurar por nome"
              items={fieldState.items}
              selectedKey={fieldState.selectedKey}
              inputValue={fieldState.inputValue}
              onOpenChange={onOpenChange}
              action={null}
              onSelectionChange={onSelectionChange}
              onInputChange={onInputChange}
              theme="dark"
              autoFocus
            >
              {(item) => <Item textValue={item.name}>{item.name}</Item>}
            </ComboBox>

            {selectedDelegates.length > 0 ?
              <>
                <div className='committee-selected-delegates'>
                  Delegados selecionados: {selectedDelegates?.map((item, index) => <span key={index}>{index !== 0 ? ", " : ""} {item.name}</span>)}
                </div>

                <Button className='text italic' onPress={clearSelectedDelegates}>
                  Limpar
                </Button>
              </> : null
            }

            <Button type='submit' className='committee-add-form-button' isDisabled={selectedDelegates.length === 0 || fetcher.state !== "idle"} onPress={handleSubmission}>
              {fetcher.state !== "idle" ? "Adicionando" : "Adicionar"}
            </Button>
          </Dialog>
        </Modal>
      }
    </AnimatePresence >
  )
}

function useAddParticipant(fetcher: FetcherWithComponents<any>, committee: any, state: OverlayTriggerState, participationMethod: ParticipationMethod): [
  any[], { id: string; name: string; }[], (delegate: { id: string; name: string; }) => void, () => void, () => void
] {
  const listDelegatesFetcher = useFetcher<any>()
  const [delegatesList, setDelegatesList] = React.useState<any[]>([])
  const [selectedDelegates, setSelectedDelegates] = React.useState<{ id: string, name: string }[]>([])

  const handleDelegateSelection = (delegate: { id: string, name: string }) => {
    if (delegate === undefined) return

    setSelectedDelegates((prevSelectedDelegates) => {
      const isAlreadySelected = prevSelectedDelegates.some((d) => d.id === delegate.id)

      if (isAlreadySelected) {
        return prevSelectedDelegates.filter((d) => d.id !== delegate.id)
      } else {
        return [...prevSelectedDelegates, delegate]
      }
    })
  }

  const clearSelectedDelegates = () => setSelectedDelegates([])

  const handleSubmission = () => {
    fetcher.submit(
      qs.stringify({ ids: selectedDelegates.map(item => item.id), committeeId: committee.id, actionType: "add" }, { arrayFormat: 'brackets' }),
      { method: "POST" }
    )
  }

  React.useEffect(() => {
    if (fetcher.data?.committee) state.close()
  }, [fetcher.data])

  React.useEffect(() => {
    if (listDelegatesFetcher.data?.delegatesList) setDelegatesList(listDelegatesFetcher.data?.delegatesList)
  }, [listDelegatesFetcher.data])

  React.useEffect(() => {
    if (state.isOpen) {
      const searchParams = new URLSearchParams([["pm", participationMethod]]);
      listDelegatesFetcher.load(`/api/admin/committee/delegates?${searchParams}`)
    }
    clearSelectedDelegates()
  }, [state.isOpen])

  return [delegatesList, selectedDelegates, handleDelegateSelection, clearSelectedDelegates, handleSubmission]
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
      items: delegatesList.filter((item: any) => startsWith(item.name.trim(), value))
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

export default AddParticipant

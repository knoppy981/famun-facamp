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
import { DelegationType } from '~/models/delegation.server';
import { UserType } from '~/models/user.server';

const RemoveParticipants = ({ state, delegation }: { state: OverlayTriggerState, delegation: DelegationType }) => {
  const fetcher = useFetcher<any>()
  const participants = delegation.participants?.map(p => ({ id: p.id, name: p.name }))
  const [selectedParticipants, handleParticipantSelection, clearSelectedParticipants, handleSubmission] = useChangeLeader(fetcher, delegation, state)
  const [fieldState, onSelectionChange, onInputChange, onOpenChange] = useComboBox(participants ?? [], handleParticipantSelection, state.close)

  return (
    <AnimatePresence>
      {state.isOpen &&
        <Modal state={state} isDismissable>
          <Dialog>
            <div className="admin-dialog-title">
              <h2>
                Remover Participantes da Delegação
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
              {(item) => <Item key={item.id}>{item.name}</Item>}
            </ComboBox>

            {selectedParticipants.length > 0 ?
              <>
                <div className='committee-selected-delegates'>
                  Participantes a serem removidos: {selectedParticipants.map((item, index) => <span key={index}>{index !== 0 ? ", " : ""} {item.name}</span>)}
                </div>

                <Button className='text italic' onPress={clearSelectedParticipants}>
                  Limpar
                </Button>
              </> : null
            }

            <Button type='submit' className='committee-add-form-button' isDisabled={selectedParticipants.length === 0} onPress={handleSubmission}>
              {fetcher.state !== "idle" ? "Removendo" : "Remover"}
            </Button>
          </Dialog>
        </Modal>
      }
    </AnimatePresence >
  )
}

function useChangeLeader(fetcher: FetcherWithComponents<any>, delegation: DelegationType, state: OverlayTriggerState): [
  { id: string; name: string }[], (delegate: { id: string; name: string; }) => void, () => void, () => void
] {
  const [selectedParticipants, setSelectedParticipants] = React.useState<{ id: string; name: string }[]>([])

  const handleParticipantSelection = (delegate: { id: string, name: string }) => {
    if (delegate === undefined) return

    setSelectedParticipants((prevSelectedParticipants) => {
      const isAlreadySelected = prevSelectedParticipants.some((d) => d.id === delegate.id)

      if (isAlreadySelected) {
        return prevSelectedParticipants.filter((d) => d.id !== delegate.id)
      } else {
        return [...prevSelectedParticipants, delegate]
      }
    });
  }

  const clearSelectedParticipants = () => setSelectedParticipants([])

  const handleSubmission = () => {
    if (selectedParticipants.length > 0) {
      fetcher.submit(
        qs.stringify({ ids: selectedParticipants.map(item => item.id), delegationId: delegation.id }),
        { method: "POST", action: "/api/admin/delegation/remove" }
      )
    }
  }

  React.useEffect(() => {
    if (fetcher.data?.delegation) {
      clearSelectedParticipants()
      state.close()
    }
  }, [fetcher.data])

  React.useEffect(() => {
    clearSelectedParticipants()
  }, [state.isOpen])

  return [selectedParticipants, handleParticipantSelection, clearSelectedParticipants, handleSubmission]
}

function useComboBox(participants: { id: string; name: any; }[], handleParticipantSelection: (delegate: { id: string; name: string; }) => void, close: () => void): [
  { selectedKey: any; inputValue: string; items: any; }, (key: React.Key) => void, (value: string) => void, (isOpen: boolean, menuTrigger?: any) => void
] {
  let [fieldState, setFieldState] = React.useState({
    selectedKey: "" as any,
    inputValue: "" as string,
    items: participants
  });

  React.useEffect(() => {
    if (true) setFieldState({
      selectedKey: "" as any,
      inputValue: "" as string,
      items: participants
    })
  }, [])

  // Implement custom filtering logic and control what items are
  // available to the ComboBox.
  let { startsWith } = useFilter({ sensitivity: 'base' });

  // Specify how each of the ComboBox values should change when an
  // option is selected from the list box
  let onSelectionChange = (key: React.Key) => {
    setFieldState((prevState) => {
      let selectedItem = prevState.items.find((option: any) => option.id === key);
      if (selectedItem) {
        handleParticipantSelection(selectedItem)
      }
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
      items: participants.filter((item) => startsWith(item.name, value))
    }));
  };

  // Show entire list if user opens the menu manually
  let onOpenChange = (isOpen: boolean, menuTrigger?: any) => {
    if (menuTrigger === 'manual' && isOpen) {
      setFieldState((prevState) => ({
        inputValue: prevState.inputValue,
        selectedKey: prevState.selectedKey,
        items: participants
      }));
    }
  };

  return [fieldState, onSelectionChange, onInputChange, onOpenChange]
}

export default RemoveParticipants

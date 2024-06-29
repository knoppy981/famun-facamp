import React from 'react'
import { FetcherWithComponents, useFetcher } from '@remix-run/react';
import { useFilter } from 'react-aria';

import Button from '~/components/button';
import ComboBox, { Item } from '~/components/combobox'
import Dialog from '~/components/dialog'
import { FiX } from "react-icons/fi/index.js";
import { DelegationType } from '~/models/delegation.server';
import { UserType } from '~/models/user.server';

const ChangeLeaderModal = ({ close, delegation }: { close: () => void, delegation: DelegationType }) => {
  const fetcher = useFetcher<any>()
  const [selectedParticipant, handleParticipantSelection, handleSubmission] = useChangeLeader(fetcher, close, delegation)
  const [fieldState, onSelectionChange, onInputChange, onOpenChange] = useComboBox(delegation.participants ?? [], handleParticipantSelection, close)

  return (
    <Dialog>
      <div className="admin-dialog-title">
        <h2>
          Designar novo líder
        </h2>

        <Button onPress={close}>
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

      <Button type='submit' className='committee-add-form-button' isDisabled={!selectedParticipant} onPress={handleSubmission}>
        {fetcher.state !== "idle" ? "Designando" : "Designar"}
      </Button>
    </Dialog>
  )
}

function useChangeLeader(fetcher: FetcherWithComponents<any>, close: () => void, delegation: DelegationType): [
  UserType | undefined, (participant: UserType) => void, () => void
] {
  const [selectedParticipant, setSelectedParticipant] = React.useState<UserType | undefined>()

  const handleParticipantSelection = (participant: UserType) => {
    setSelectedParticipant(participant)
  }

  const handleSubmission = () => {
    if (selectedParticipant?.id) {
      fetcher.submit(
        { participantId: selectedParticipant.id, leaderId: delegation.participants?.find(p => p.leader)?.id ?? "", delegationId: delegation.id },
        { method: "post", action: "/api/delegation/leader" }
      )
    }
  }

  React.useEffect(() => {
    if (fetcher.data?.delegation) close()
  }, [fetcher.data])

  return [selectedParticipant, handleParticipantSelection, handleSubmission]
}

function useComboBox(participants: UserType[], handleParticipantSelection: (participant: UserType) => void, close: () => void): [
  { selectedKey: any; inputValue: string; items: any; }, (key: React.Key) => void, (value: string) => void, (isOpen: boolean, menuTrigger?: any) => void
] {
  const filteredParticipants = participants.filter(p => !p.leader)

  let [fieldState, setFieldState] = React.useState({
    selectedKey: "" as any,
    inputValue: "" as string,
    items: filteredParticipants
  });

  React.useEffect(() => {
    setFieldState({
      selectedKey: "" as any,
      inputValue: "" as string,
      items: filteredParticipants
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
        inputValue: selectedItem?.name ?? '',
        selectedKey: key,
        items: filteredParticipants.filter((item) =>
          startsWith(item.name, selectedItem?.name ?? '')
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
      items: filteredParticipants.filter((item) => startsWith(item.name.trim(), value))
    }));
  };

  // Show entire list if user opens the menu manually
  let onOpenChange = (isOpen: boolean, menuTrigger?: any) => {
    if (menuTrigger === 'manual' && isOpen) {
      setFieldState((prevState) => ({
        inputValue: prevState.inputValue,
        selectedKey: prevState.selectedKey,
        items: filteredParticipants
      }));
    }
  };

  return [fieldState, onSelectionChange, onInputChange, onOpenChange]
}

export default ChangeLeaderModal

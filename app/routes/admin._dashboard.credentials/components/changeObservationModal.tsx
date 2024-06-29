import { FetcherWithComponents, useFetcher } from '@remix-run/react'
import { AnimatePresence } from 'framer-motion'
import React, { ChangeEvent } from 'react'
import { OverlayTriggerState } from 'react-stately'
import Button from '~/components/button'
import Dialog from '~/components/dialog'
import Modal from '~/components/modalOverlay'
import { FiX } from "react-icons/fi/index.js";
import TextField from '~/components/textfield'
import Spinner from '~/components/spinner'
import { UserType } from '~/models/user.server'
import TextArea from '~/components/textfield/textArea'

const ChangeObservationModal = ({ close, participant }: { close: () => void, participant: UserType }) => {
  const fetcher = useFetcher<any>()
  const [handleChangeObservation, value, setValue] = useChangeObservation(close, fetcher, participant)

  if (!participant) return null

  return (
    <Dialog>
      <div className="admin-dialog-title">
        <h2>
          {participant?.presenceControl?.observation ? "Alterar a observações" : "Adicionar obervações"}
        </h2>

        <Button onPress={close}>
          <FiX className='icon' />
        </Button>
      </div>

      <fetcher.Form className='committee-add-form' method='POST'>
        <TextArea
          className='textarea-input-box'
          name="maxParticipants"
          label="Observações"
          theme='dark'
          value={value}
          onChange={(e: any) => setValue(e.target.value)}
        />

        <Button
          type='button'
          className='committee-add-form-button'
          isDisabled={fetcher.state !== "idle" || value === participant?.presenceControl?.observation}
          onPress={handleChangeObservation}
        >
          {fetcher.state !== 'idle' && <Spinner dim="18px" color='#fff' />}
          {participant?.presenceControl?.observation ? "Alterar" : "Adicionar"}
        </Button>
      </fetcher.Form>
    </Dialog>
  )
}

function useChangeObservation(close: () => void, fetcher: FetcherWithComponents<any>, participant: UserType): [
  () => void, string, React.Dispatch<React.SetStateAction<string>>
] {
  const [value, setValue] = React.useState(participant?.presenceControl?.observation ?? "")

  const handleChangeObservation = () => {
    fetcher.submit(
      { participantId: participant?.id, observation: value },
      { method: "post", preventScrollReset: true, navigate: false, }
    )
  }

  React.useEffect(() => {
    if (fetcher.data?.participant) close()
  }, [fetcher.data])

  return [handleChangeObservation, value, setValue]
}

export default ChangeObservationModal

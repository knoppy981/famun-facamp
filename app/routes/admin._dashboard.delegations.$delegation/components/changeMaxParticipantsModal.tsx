import { FetcherWithComponents, useFetcher } from '@remix-run/react'
import React from 'react'
import Button from '~/components/button'
import Dialog from '~/components/dialog'
import { FiX } from "react-icons/fi/index.js";
import { NumberField } from '~/components/textfield/numberField'
import Spinner from '~/components/spinner'

const ChangeMaxParticipantsModal = ({ close, maxParticipants, delegationId, participantsCount }: { close: () => void, maxParticipants: number, delegationId: string, participantsCount: number }) => {
  const fetcher = useFetcher<any>()
  const [handleChangeMaxParticipants, value, setValue] = useChangeMaxParticipants(close, fetcher, maxParticipants, delegationId)

  return (
    <Dialog>
      <div className="admin-dialog-title">
        <h2>
          Alterar o máximo de delegados
        </h2>

        <Button onPress={close}>
          <FiX className='icon' />
        </Button>
      </div>

      <fetcher.Form className='committee-add-form' method='POST'>
        <NumberField
          className='primary-input-box'
          name="maxParticipants"
          label="Número de Delegados"
          theme='dark'
          minValue={participantsCount}
          value={value}
          onChange={e => setValue(e as number)}
          maxValue={20}
        />

        <Button
          type='button'
          className='committee-add-form-button'
          isDisabled={fetcher.state !== "idle" || value === maxParticipants}
          onPress={handleChangeMaxParticipants}
        >
          {fetcher.state !== 'idle' && <Spinner dim="18px" color='#fff' />}
          Alterar
        </Button>
      </fetcher.Form>
    </Dialog>
  )
}

function useChangeMaxParticipants(close: () => void, fetcher: FetcherWithComponents<any>, maxParticipants: number, delegationId: string): [
  () => void, number, React.Dispatch<React.SetStateAction<number>>
] {
  const [value, setValue] = React.useState(maxParticipants)

  const handleChangeMaxParticipants = () => {
    fetcher.submit(
      { delegationId, maxParticipants: value },
      { method: "post", action: "/api/admin/delegation/maxParticipants", preventScrollReset: true, navigate: false, }
    )
  }

  React.useEffect(() => {
    if (fetcher.data?.delegation) close()
  }, [fetcher.data])

  return [handleChangeMaxParticipants, value, setValue]
}

export default ChangeMaxParticipantsModal

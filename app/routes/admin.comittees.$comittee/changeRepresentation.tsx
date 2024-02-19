import React, { Key } from 'react'
import { AnimatePresence } from 'framer-motion'
import qs from 'qs'
import { ParticipationMethod } from '@prisma/client'
import { OverlayTriggerState } from 'react-stately'

import Modal from '~/components/modalOverlay'
import Button from '~/components/button';
import Dialog from '~/components/dialog'
import { FiX } from "react-icons/fi/index.js";
import ComboBox, { Item } from '~/components/combobox'
import { isoCountries } from '~/lib/ISO-3661-1'
import { FetcherWithComponents, useFetcher } from '@remix-run/react'
import { ComitteeType } from './route'

type delegateType = {
  id: string;
  country: string | null;
  user: {
    name: string;
    _count: {
      files: number;
    };
    delegation: {
      school: string;
      participants: {
        name: string;
      }[];
    } | null;
  };
} | undefined

const ChangeRepresentation = ({ state, comittee, participationMethod, selectedDelegate }: { state: OverlayTriggerState, comittee: ComitteeType, participationMethod: ParticipationMethod, selectedDelegate: delegateType }) => {
  const fetcher = useFetcher<any>()
  const [countryArray, country, setCountry, handleSubmission] = useChangeRepresentation(fetcher, state, selectedDelegate)

  return (
    <AnimatePresence>
      {state.isOpen &&
        <Modal state={state} isDismissable>
          <Dialog>
            <div className="admin-dialog-title">
              <h2>
                Escolher representação
              </h2>

              <Button onPress={state.close}>
                <FiX className='icon' />
              </Button>
            </div>

            <ComboBox
              className='primary-input-box'
              name="user-search"
              label="Procurar pelo país"
              defaultItems={countryArray}
              onSelectionChange={(key: React.Key) => setCountry(key as string)}
              action={null}
              theme="dark"
              leftItem={country && <div className={`join-nacionality-flag flag-icon flag-icon-${isoCountries[country]?.toLowerCase()}`} />}
            >
              {(item) => <Item textValue={item.id}>{item.id}</Item>}
            </ComboBox>

            <div className='comittee-selected-delegates'>
              Após salvar esta nova representação, o(a) delegado(a) {selectedDelegate?.user.name} recebera um aviso no sistema sobre essa alteração
            </div>

            <Button type='submit' className='comittee-add-form-button' isDisabled={country === null || fetcher.state !== "idle"} onPress={handleSubmission}>
              {fetcher.state !== "idle" ? "Salvando" : "Salvar"}
            </Button>
          </Dialog>
        </Modal>
      }
    </AnimatePresence >
  )
}

function useChangeRepresentation(fetcher: FetcherWithComponents<any>, state: OverlayTriggerState, selectedDelegate: delegateType): [
  { id: string }[], string | null, React.Dispatch<React.SetStateAction<string | null>>, () => void
] {
  function createCountryArray(countries: object) {
    return Object.keys(countries).map(countryName => {
      return {
        id: countryName
      };
    });
  }
  const countryArray = createCountryArray(isoCountries)
  const [country, setCountry] = React.useState<string | null>(null)

  const handleSubmission = () => {
    fetcher.submit(
      qs.stringify({ delegateId: selectedDelegate?.id, country }),
      { method: "POST" }
    )
  }

  React.useEffect(() => {
    if (fetcher.data?.delegate) state.close()
  }, [fetcher.data])

  React.useEffect(() => {
    if (!state.isOpen) setCountry(null)
  }, [state.isOpen])

  return [countryArray, country, setCountry, handleSubmission]
}

export default ChangeRepresentation

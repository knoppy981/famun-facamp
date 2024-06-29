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
import { CommitteeType } from '../route'

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

const ChangeRepresentationModal = ({ close, committee, participationMethod, selectedDelegate, representations }:
  { close: () => void, committee: CommitteeType, participationMethod: ParticipationMethod, selectedDelegate: delegateType, representations: string[] | undefined }
) => {
  const fetcher = useFetcher<any>()
  const [countryArray, country, setCountry, handleSubmission] = useChangeRepresentation(fetcher, close, selectedDelegate, representations)

  return (
    <Dialog>
      <div className="admin-dialog-title">
        <h2>
          Escolher representação
        </h2>

        <Button onPress={close}>
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

      <div className='committee-selected-delegates'>
        Após salvar esta nova representação, o(a) delegado(a) {selectedDelegate?.user.name} recebera um aviso no sistema sobre essa alteração
      </div>

      <Button type='submit' className='committee-add-form-button' isDisabled={country === null || fetcher.state !== "idle"} onPress={handleSubmission}>
        {fetcher.state !== "idle" ? "Salvando" : "Salvar"}
      </Button>
    </Dialog>
  )
}

function useChangeRepresentation(fetcher: FetcherWithComponents<any>, close: () => void, selectedDelegate: delegateType, representations: string[] | undefined): [
  { id: string }[], string | null, React.Dispatch<React.SetStateAction<string | null>>, () => void
] {
  function createCountryArray(countries: object) {
    const arr = Object.keys(countries).map(countryName => {
      return {
        id: countryName
      };
    });

    if (representations) {
      representations.forEach(item => {
        arr.push({ id: item })
      })
    }

    return arr
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
    if (fetcher.data?.delegate) close()
  }, [fetcher.data])

  return [countryArray, country, setCountry, handleSubmission]
}

export default ChangeRepresentationModal

import React from 'react'
import { LoaderFunctionArgs, json } from '@remix-run/node';
import { FetcherWithComponents, Form, useFetcher, useLoaderData, useOutletContext, useSearchParams, useSubmit } from '@remix-run/react'

import { adminDelegationsList } from '~/models/delegation.server';

import { FiCheckCircle, FiChevronLeft, FiChevronRight, FiXCircle } from "react-icons/fi/index.js";
import { ParticipationMethod } from '@prisma/client';
import Button from '~/components/button'
import Spinner from '~/components/spinner'
import Link from '~/components/link';
import TextField from '~/components/textfield';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const searchIndex = url.searchParams.get("i");
  const query = url.searchParams.get("participant-search");
  const participationMethod = url.searchParams.get("pm") as ParticipationMethod

  const delegations = await adminDelegationsList(Number(searchIndex) ?? 0, participationMethod ?? "Escola", query as string)

  return json({ delegations })
}

const Participants = () => {
  const fetcher = useFetcher<any>()
  const formRef = React.useRef<HTMLFormElement>(null)
  const { participationMethod } = useOutletContext<{ participationMethod: ParticipationMethod }>()
  const { delegations: _delegations } = useLoaderData<typeof loader>()
  const [searchIndex, setSearchIndex, delegations] = useDelegationsList(fetcher, participationMethod, _delegations, formRef)
  const delegationFetcher = useFetcher<any>()

  return (
    <fetcher.Form ref={formRef} onChange={e => { fetcher.submit(e.currentTarget, { method: "GET" }) }} className='admin-container' >

      <div className='admin-search-container'>
        <TextField
          className="admin-search-input-box"
          name="participant-search"
          aria-label="Procurar"
          type="text"
          isRequired
          onChange={() => { setSearchIndex(0) }}
          placeholder='Procurar...'
        />
      </div>

      <div className='overflow-container'>
        <table className='table'>
          <thead>
            <tr className="table-row example">
              <td className='table-cell'>
                x
              </td>
            </tr>
          </thead>

          <tbody>
            {[].map((item, index) => (
              <tr
                className="table-row cursor"
                key={index}
                onClick={() => { }}
                tabIndex={0}
                role="link"
                aria-label={`Details for delegation ${" "}`}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === 'Space') {
                    event.preventDefault();
                  }
                }}
              >
                <td className='table-cell'>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <input type='hidden' name="i" value={String(searchIndex)} />
      <input type='hidden' name="pm" value={participationMethod} />

      <div className='admin-navigation-button-container'>
        <Button onPress={() => { setSearchIndex(prevValue => prevValue - 1) }} isDisabled={searchIndex < 1}>
          <FiChevronLeft className='icon' />
        </Button>

        Página {searchIndex + 1}

        <Button onPress={() => { setSearchIndex(prevValue => prevValue + 1) }} isDisabled={delegations.length < 12}>
          <FiChevronRight className='icon' />
        </Button>
      </div>
    </fetcher.Form>
  )
}

function useDelegationsList(fetcher: FetcherWithComponents<any>, participationMethod: ParticipationMethod, _delegations: any[], formRef: React.RefObject<HTMLFormElement>): [
  number,
  React.Dispatch<React.SetStateAction<number>>,
  any[]] {
  const [searchIndex, setSearchIndex] = React.useState<number>(0)
  const [participants, setParticipants] = React.useState(_delegations)

  React.useEffect(() => {
    setParticipants(fetcher.data?.delegations ? fetcher.data?.delegations : _delegations)
  }, [fetcher.data, _delegations])

  React.useEffect(() => {
    setSearchIndex(0)
  }, [participationMethod])

  React.useEffect(() => {
    fetcher.submit(formRef.current, { method: "GET" })
  }, [participationMethod, searchIndex])

  return [searchIndex, setSearchIndex, participants]
}

export default Participants

import React from 'react'
import { LoaderFunctionArgs, json } from '@remix-run/node';
import { FetcherWithComponents, useFetcher, useLoaderData, useOutletContext } from '@remix-run/react'


import { FiChevronDown, FiChevronLeft, FiChevronRight } from "react-icons/fi/index.js";
import { ParticipationMethod } from '@prisma/client';
import Button from '~/components/button'
import TextField from '~/components/textfield';
import { adminParticipantList } from '~/models/user.server';
import { ParticipantType } from './types';
import PopoverTrigger from '~/components/popover/trigger';
import Dialog from '~/components/dialog';
import { Radio, RadioGroup } from '~/components/radioGroup';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const searchIndex = url.searchParams.get("i");
  const query = url.searchParams.get("participant-search");
  const orderBy = url.searchParams.get("order-by");
  const participationMethod = url.searchParams.get("pm") as ParticipationMethod

  const participants = await adminParticipantList(Number(searchIndex) ?? 0, participationMethod ?? "Escola", orderBy ?? "user", query as string)

  return json({ participants })
}

const Participants = () => {
  const fetcher = useFetcher<any>()
  const formRef = React.useRef<HTMLFormElement>(null)
  const { participationMethod } = useOutletContext<{ participationMethod: ParticipationMethod }>()
  const { participants: _participants } = useLoaderData<typeof loader>()
  const [searchIndex, setSearchIndex, orderBy, setOrderBy, participants] = useDelegationsList(fetcher, participationMethod, _participants, formRef)

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

        <PopoverTrigger label={<>Ordenar por <FiChevronDown className='icon' /></>}>
          <Dialog maxWidth style={{ padding: "15px 15px 15px 10px" }}>
            <RadioGroup
              className='documents-radio-input-box'
              aria-label="Ordenar por"
              name='order-by'
              action={undefined}
              isDisabled={undefined}
              value={orderBy}
              onChange={setOrderBy}
            >
              {[["Ordem alfabética", "name"], ["Delegação", "delegation"], ["Data de inscrição", "createdAt"]].map((item, i) => {
                return (
                  <Radio key={i} value={item[1]}>{item[0]}</Radio>
                )
              })}
            </RadioGroup>
          </Dialog>
        </PopoverTrigger>

        <input type='hidden' name='order-by' value={orderBy} />
      </div>

      <div className='overflow-container'>
        <table className='table'>
          <thead>
            <tr className="table-row example">
              <td className='table-cell'>
                Nome
              </td>

              <td className='table-cell'>
                Delegação
              </td>

              <td className='table-cell' style={{ paddingLeft: "30px" }}>
                Posição
              </td>

              <td className='table-cell'>
                Entrou em
              </td>
            </tr>
          </thead>

          <tbody>
            {participants.map((item, index) => (
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
                  {item.name}
                </td>

                <td className='table-cell'>
                  {item.delegation?.school}
                </td>

                <td className='table-cell'>
                  <div className='table-flex-cell'>
                    <div className={`secondary-button-box ${item.delegationAdvisor ? 'green-light' : 'blue-light'}`}>
                      <div>
                        {item.delegationAdvisor ? item?.delegationAdvisor?.advisorRole : "Delegado"}
                      </div>
                    </div>
                  </div>
                </td>

                <td className='table-cell'>
                  {new Date(item.createdAt).toLocaleDateString('pt-BR')}
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

        <Button onPress={() => { setSearchIndex(prevValue => prevValue + 1) }} isDisabled={participants.length < 12}>
          <FiChevronRight className='icon' />
        </Button>
      </div>
    </fetcher.Form >
  )
}

function useDelegationsList(
  fetcher: FetcherWithComponents<any>,
  participationMethod: ParticipationMethod,
  _participants: any[],
  formRef: React.RefObject<HTMLFormElement>
): [
    number,
    React.Dispatch<React.SetStateAction<number>>,
    string,
    React.Dispatch<React.SetStateAction<string>>,
    ParticipantType[]
  ] {
  const [searchIndex, setSearchIndex] = React.useState<number>(0)
  const [orderBy, setOrderBy] = React.useState<string>("name")
  const [participants, setParticipants] = React.useState(_participants)

  React.useEffect(() => {
    setParticipants(fetcher.data?.participants ? fetcher.data?.participants : _participants)
  }, [fetcher.data, _participants])

  React.useEffect(() => {
    setSearchIndex(0)
  }, [participationMethod])

  React.useEffect(() => {
    fetcher.submit(formRef.current, { method: "GET" })
  }, [participationMethod, searchIndex, orderBy])

  return [searchIndex, setSearchIndex, orderBy, setOrderBy, participants]
}

export default Participants

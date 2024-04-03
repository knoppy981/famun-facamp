import React from 'react'
import { LoaderFunctionArgs, json } from '@remix-run/node';
import { FetcherWithComponents, Form, SubmitFunction, useFetcher, useLoaderData, useOutletContext, useSubmit } from '@remix-run/react'


import { FiChevronDown, FiChevronLeft, FiChevronRight, FiDownload } from "react-icons/fi/index.js";
import { ParticipationMethod } from '@prisma/client';
import Button from '~/components/button'
import TextField from '~/components/textfield';
import { adminParticipantList } from '~/models/user.server';
import { ParticipantType } from './types';
import PopoverTrigger from '~/components/popover/trigger';
import Dialog from '~/components/dialog';
import { Radio, RadioGroup } from '~/components/radioGroup';
import useDidMountEffect from '~/hooks/useDidMountEffect';
import { exportAoo } from '~/sheets';
import Spinner from '~/components/spinner';
import { useParticipantModal } from '../admin._dashboard/participantModal/useParticipantModal';
import ParticipantModal from '../admin._dashboard/participantModal';

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
  const submit = useSubmit()
  const formRef = React.useRef<HTMLFormElement>(null)
  const { participationMethod } = useOutletContext<{ participationMethod: ParticipationMethod }>()
  const { participants } = useLoaderData<typeof loader>()
  const [searchIndex, handleSearchIndex, orderBy, handleOrderBy, resetIndex] = useDelegationsList(submit, formRef, participationMethod)
  const [handleParticipantsSheet, downloadState] = useParticipantsSheet(participationMethod)
  const [overlayState, selectedParticipantId, handleParticipantChange] = useParticipantModal()

  return (
    <>
      <ParticipantModal state={overlayState} participant={participants.find(participant => participant.id === selectedParticipantId) as any} />

      <Form ref={formRef} onChange={e => { submit(e.currentTarget, { method: "GET" }) }} className='admin-container' >
        <div className='admin-search-container'>
          <TextField
            className="admin-search-input-box"
            name="participant-search"
            aria-label="Procurar"
            type="text"
            isRequired
            onChange={resetIndex}
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
                onChange={handleOrderBy}
              >
                {[["Ordem alfabética", "name"], ["Delegação", "delegation"], ["Data de inscrição", "createdAt"], ["Posição", "position"]].map((item, i) => {
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
              {participants.map((participant, index) => {
                return (
                  <tr
                    className="table-row cursor"
                    key={index}
                    onClick={() => {
                      handleParticipantChange(participant.id)
                      overlayState.toggle()
                    }}
                    tabIndex={0}
                    role="link"
                    aria-label={`Change representation for ${" "}`}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === 'Space') {
                        event.preventDefault();
                        handleParticipantChange(participant.id)
                        overlayState.toggle()
                      }
                    }}
                  >
                    <td className='table-cell'>
                      {participant.name}
                    </td>

                    <td className='table-cell'>
                      {participant.delegation?.school}
                    </td>

                    <td className='table-cell'>
                      <div className='table-flex-cell'>
                        <div className={`secondary-button-box ${participant.delegationAdvisor ? 'green-light' : 'blue-light'}`}>
                          <div className='button-child'>
                            {participant.delegationAdvisor ? participant?.delegationAdvisor?.advisorRole : "Delegado"}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className='table-cell'>
                      {new Date(participant.createdAt).toLocaleString('pt-BR', {
                        timeZone: 'America/Sao_Paulo',
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric'
                      })}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <input type='hidden' name="i" value={String(searchIndex)} />
        <input type='hidden' name="pm" value={participationMethod} />

        <div className='admin-navigation-button-container'>
          <div>
            <Button onPress={() => handleParticipantsSheet("rg")} className='secondary-button-box green-light'>
              {downloadState === "idle" ? <FiDownload className='icon' /> : <Spinner dim='18px' color='green' />} Planilha RG/Passporte
            </Button>

            <Button onPress={() => handleParticipantsSheet("cracha delegados")} className='secondary-button-box green-light'>
              {downloadState === "idle" ? <FiDownload className='icon' /> : <Spinner dim='18px' color='green' />} Planilha Cracha Delegados
            </Button>

            <Button onPress={() => handleParticipantsSheet("cracha orientadores")} className='secondary-button-box green-light'>
              {downloadState === "idle" ? <FiDownload className='icon' /> : <Spinner dim='18px' color='green' />} Planilha Cracha Orientadores
            </Button>
          </div>

          <div>
            <Button onPress={() => handleSearchIndex(false)} isDisabled={searchIndex < 1}>
              <FiChevronLeft className='icon' />
            </Button>

            Página {searchIndex + 1}

            <Button onPress={() => handleSearchIndex(true)} isDisabled={participants.length < 12}>
              <FiChevronRight className='icon' />
            </Button>
          </div>
        </div>
      </Form >
    </>
  )
}

function useDelegationsList(submit: SubmitFunction, formRef: React.RefObject<HTMLFormElement>, participationMethod: ParticipationMethod,): [
  number,
  (isAdding: boolean) => void,
  string,
  (value: string) => void,
  () => void
] {
  const [searchIndex, setSearchIndex] = React.useState<number>(0)
  const [orderBy, setOrderBy] = React.useState<string>("name")
  // adding this extra state so that the form is only submitted when handle is triggered, can't modify formRef.current have to wait to state to update
  const [testState, setTestState] = React.useState(false)

  function handleSearchIndex(isAdding: boolean) {
    setSearchIndex(prevValue => isAdding ? prevValue + 1 : prevValue - 1)
    setTestState(!testState)
  }

  function handleOrderBy(value: string) {
    setOrderBy(value)
    resetIndex()
    setTestState(!testState)
  }

  function resetIndex() {
    setSearchIndex(0)
  }

  useDidMountEffect(() => {
    submit(formRef.current, { method: "GET" })
  }, [testState])

  useDidMountEffect(() => {
    resetIndex()
  }, [participationMethod])


  return [searchIndex, handleSearchIndex, orderBy, handleOrderBy, resetIndex]
}

function useParticipantsSheet(participationMethod: ParticipationMethod): [(type: "rg" | "cracha delegados" | "cracha orientadores") => void, "idle" | "loading" | "submitting"] {
  const fetcher = useFetcher<any>()

  const handleDownload = (type: "rg" | "cracha delegados" | "cracha orientadores") => {
    const searchParams = new URLSearchParams([["pm", participationMethod], ["type", type]]);
    fetcher.load(`/api/aoo/participants?${searchParams}`)
  }

  React.useEffect(() => {
    if (fetcher.data?.aoo && fetcher.data?.type) {
      exportAoo(fetcher.data?.aoo, `Participantes_${participationMethod === "Escola" ? "Ensino Médio" : participationMethod}_${fetcher.data?.type}`)
    }
  }, [fetcher.data])

  return [handleDownload, fetcher.state]
}

export default Participants

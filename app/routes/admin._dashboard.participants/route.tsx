import React from 'react'
import { LoaderFunctionArgs, json } from '@remix-run/node';
import { Form, SubmitFunction, useFetcher, useLoaderData, useOutletContext, useSearchParams, useSubmit } from '@remix-run/react'
import { ParticipationMethod } from '@prisma/client';

import { exportAoo } from '~/sheets';
import { adminParticipantList } from '~/models/user.server';
import useDidMountEffect from '~/hooks/useDidMountEffect';

import Button from '~/components/button'
import TextField from '~/components/textfield';
import PopoverTrigger from '~/components/popover/trigger';
import Dialog from '~/components/dialog';
import { Radio, RadioGroup } from '~/components/radioGroup';
import Spinner from '~/components/spinner';
import { useParticipantModal } from '../admin._dashboard/hooks/useParticipantModal';
import ParticipantModal from '../admin._dashboard/components/participantModal';
import { FiCheckSquare, FiChevronDown, FiChevronLeft, FiChevronRight, FiDownload, FiX } from "react-icons/fi/index.js";
import Checkbox from '~/components/checkbox';

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
  const [handleParticipantsSheet, downloadState] = useParticipantsSheet(participationMethod)
  const [overlayState, selectedParticipantId, handleParticipantChange] = useParticipantModal()
  const [searchParams] = useSearchParams()

  return (
    <>
      <ParticipantModal state={overlayState} participant={participants.find(participant => participant.id === selectedParticipantId) as any} />

      <Form className='admin-container' preventScrollReset ref={formRef}>
        <div className='admin-search-container'>
          <TextField
            className="admin-search-input-box"
            name="participant-search"
            aria-label="Procurar"
            type="text"
            isRequired
            onChange={() => {
              const formData = new FormData(formRef.current ?? undefined);
              formData.set('order-by', searchParams.get("order-by") ?? "name")
              submit(formData, { method: "GET", preventScrollReset: true })
            }}
            defaultValue={searchParams.get("participant-search") ?? ""}
            placeholder='Procurar...'
          />

          <div className='admin-search-filter-box'>
            <PopoverTrigger label={<>Ordenar por <FiChevronDown className='icon' /></>}>
              <Dialog maxWidth style={{ padding: "15px 15px 15px 10px" }}>
                <RadioGroup
                  className='documents-radio-input-box'
                  aria-label="Ordenar por"
                  name='order-by'
                  action={undefined}
                  isDisabled={undefined}
                  defaultValue={searchParams.get("order-by") ?? "name"}
                  onChange={value => {
                    const formData = new FormData(formRef.current ?? undefined);
                    formData.set('order-by', value)
                    submit(formData, { method: "GET", preventScrollReset: true })
                  }}
                >
                  {[["Ordem alfabética", "name"], ["Delegação", "delegation"], ["Data de inscrição", "createdAt"], ["Posição", "position"]].map((item, i) => {
                    return (
                      <Radio key={i} value={item[1]}>{item[0]}</Radio>
                    )
                  })}
                </RadioGroup>
              </Dialog>
            </PopoverTrigger>
          </div>
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
                      <div className='table-flex-cell'>
                        {participant.name}
                      </div>
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
            <Button
              onPress={() => {
                const formData = new FormData(formRef.current ?? undefined);
                let nextIndex = Number(searchParams.get("i") ?? 0) - 1
                formData.set('i', String(nextIndex))
                formData.set('order-by', searchParams.get("order-by") ?? "name")
                submit(formData, { method: "GET", preventScrollReset: true })
              }}
              isDisabled={Number(searchParams.get("i")) < 1}
            >
              <FiChevronLeft className='icon' />
            </Button>

            Página {Number(searchParams.get("i") ?? 0) + 1}

            <Button
              onPress={() => {
                const formData = new FormData(formRef.current ?? undefined);
                let nextIndex = Number(searchParams.get("i") ?? 0) + 1
                formData.set('i', String(nextIndex))
                formData.set('order-by', searchParams.get("order-by") ?? "name")
                submit(formData, { method: "GET", preventScrollReset: true })
              }}
              isDisabled={participants.length < 12}
            >
              <FiChevronRight className='icon' />
            </Button>
          </div>
        </div>

        <input type='hidden' name='pm' value={participationMethod} />
      </Form >
    </>
  )
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

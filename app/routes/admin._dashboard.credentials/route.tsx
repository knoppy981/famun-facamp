import React from 'react'
import { ActionFunctionArgs, LoaderFunctionArgs, json } from '@remix-run/node';
import { Form, SubmitFunction, useLoaderData, useOutletContext, useSubmit } from '@remix-run/react'
import { ParticipationMethod } from '@prisma/client';

import { credentialsParticipantList } from '~/models/user.server';
import useDidMountEffect from '~/hooks/useDidMountEffect';

import Button from '~/components/button'
import TextField from '~/components/textfield';
import PopoverTrigger from '~/components/popover/trigger';
import Dialog from '~/components/dialog';
import { Radio, RadioGroup } from '~/components/radioGroup';
import { FiChevronDown, FiChevronLeft, FiChevronRight } from "react-icons/fi/index.js";
import Checkbox from '~/components/checkbox';
import ChangeObservation from './changeObservation';
import { OverlayTriggerState, useOverlayTriggerState } from 'react-stately';
import { requireAdminId } from '~/session.server';
import { changeObservation, handleCheckIn } from '~/models/credentials.server';

export const action = async ({ request }: ActionFunctionArgs) => {
  await requireAdminId(request)
  const formData = await request.formData();
  const participantId = formData.get("participantId") as string
  const observation = formData.get("observation") as string
  const checkin = formData.get("checkin")

  let participant

  if (observation) {
    try {
      participant = await changeObservation(participantId, observation)
    } catch (error) {
      return json(
        { errors: { observation: "Erro ao alterar a observação" } },
        { status: 400 }
      );
    }
  } else if (checkin && (checkin === "true" || checkin === "false")) {
    try {
      participant = await handleCheckIn(participantId, checkin === "true")
    } catch (error) {
      return json(
        { errors: { observation: "Erro ao alterar a observação" } },
        { status: 400 }
      );
    }
  }

  return json({ participant })
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const searchIndex = url.searchParams.get("i");
  const query = url.searchParams.get("participant-search");
  const orderBy = url.searchParams.get("order-by");
  const participationMethod = url.searchParams.get("pm") as ParticipationMethod

  const participants = await credentialsParticipantList(Number(searchIndex) ?? 0, participationMethod ?? "Escola", orderBy ?? "user", query as string)

  return json({ participants })
}

const Credentials = () => {
  const submit = useSubmit()
  const formRef = React.useRef<HTMLFormElement>(null)
  const { participationMethod } = useOutletContext<{ participationMethod: ParticipationMethod }>()
  const { participants } = useLoaderData<typeof loader>()
  const [searchIndex, handleSearchIndex, orderBy, handleOrderBy, resetIndex] = useParticipantslist(submit, formRef, participationMethod)
  const [overlayState, selectedParticipantId, handleParticipantChange, handleCheckin] = usePresenceControl(submit)

  const ref = React.useRef<HTMLInputElement>(null)
  React.useEffect(() => {
    if (ref.current) ref.current.value = ""
  }, [participationMethod])

  return (
    <>
      <ChangeObservation state={overlayState} participant={participants.find(participant => participant.id === selectedParticipantId) as any} />

      <div className='admin-container'>
        <Form className='admin-search-container' ref={formRef} onChange={e => { submit(e.currentTarget, { method: "GET", preventScrollReset: true }) }} preventScrollReset>
          <TextField
            className="admin-search-input-box"
            name="participant-search"
            aria-label="Procurar"
            type="text"
            isRequired
            onChange={resetIndex}
            placeholder='Procurar...'
            ref={ref}
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
          </div>

          <input type='hidden' name='order-by' value={orderBy} />
          <input type='hidden' name="i" value={String(searchIndex)} />
          <input type='hidden' name="pm" value={participationMethod} />
        </Form>

        <div className='overflow-container'>
          <table className='table'>
            <thead>
              <tr className="table-row example">
                <td className='table-cell'>
                  Check-in
                </td>

                <td className='table-cell'>
                  Nome Completo
                </td>

                <td className='table-cell'>
                  Liability Waiver
                </td>

                <td className='table-cell'>
                  Observações
                </td>

                <td className='table-cell' style={{ paddingLeft: "30px" }}>
                  Posição
                </td>

                <td className='table-cell'>
                  RG
                </td>

                <td className='table-cell'>
                  Telefone
                </td>

                <td className='table-cell'>
                  E-mail
                </td>

                <td className='table-cell'>
                  Delegação
                </td>

                <td className='table-cell'>
                  Head Delegate
                </td>
              </tr>
            </thead>

            <tbody>
              {participants.map((participant, index) => {
                return (
                  <tr
                    className="table-row"
                    key={index}
                    tabIndex={0}
                  >
                    <td className='table-cell'>
                      <div className='table-flex-cell'>
                        <Checkbox
                          name="check"
                          aria-label='check-presence'
                          defaultSelected={participant.presenceControl?.checked}
                          onChange={value => handleCheckin(participant.id, value)}
                        />
                      </div>
                    </td>

                    <td className='table-cell'>
                      <div className='table-flex-cell'>
                        {participant.name}
                      </div>
                    </td>

                    <td className='table-cell'>
                      {participant.files[0] ? "Entregue" : ""}
                    </td>

                    <td className='table-cell'>
                      <div className='table-flex-cell'>
                        <Button
                          className={participant.presenceControl?.observation ? "default-button" : "secondary-button-box green-light"}
                          onPress={() => {
                            handleParticipantChange(participant.id)
                            overlayState.toggle()
                          }}
                        >
                          {participant.presenceControl?.observation ?
                            <div style={{ maxWidth: "150px" }}>
                              <p className='text overflow'>
                                {participant.presenceControl?.observation}
                              </p>
                            </div>
                            :
                            "Adicionar"
                          }
                        </Button>
                      </div>
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
                      {participant?.rg ?? participant?.passport}
                    </td>

                    <td className='table-cell'>
                      {participant.phoneNumber}
                    </td>

                    <td className='table-cell'>
                      {participant.email}
                    </td>

                    <td className='table-cell'>
                      {participant.delegation?.school}
                    </td>

                    <td className='table-cell'>
                      {participant.delegation?.participants[0]?.name}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>


        <div className='admin-navigation-button-container'>
          <div></div>

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
      </div>
    </>
  )
}

export function usePresenceControl(submit: SubmitFunction): [OverlayTriggerState, any, React.Dispatch<any>, (participantId: string, checkin: any) => void] {
  const [selectedParticipantId, setSelectedParticipantId] = React.useState<string>()
  const overlayState = useOverlayTriggerState({})
  const handleParticipantChange = (participantId: string) => {
    setSelectedParticipantId(participantId)
  }

  const handleCheckin = (participantId: string, checkin: any) => {
    submit(
      { participantId, checkin },
      { method: "post", preventScrollReset: true }
    )
  }

  return [overlayState, selectedParticipantId, handleParticipantChange, handleCheckin]
}

function useParticipantslist(submit: SubmitFunction, formRef: React.RefObject<HTMLFormElement>, participationMethod: ParticipationMethod,): [
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
    submit(formRef.current, { method: "GET", preventScrollReset: true })
  }, [testState])

  useDidMountEffect(() => {
    resetIndex()
  }, [participationMethod])


  return [searchIndex, handleSearchIndex, orderBy, handleOrderBy, resetIndex]
}

export default Credentials

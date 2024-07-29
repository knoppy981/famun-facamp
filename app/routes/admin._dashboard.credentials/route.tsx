import React from 'react'
import { ActionFunctionArgs, LoaderFunctionArgs, json } from '@remix-run/node';
import { Form, useLoaderData, useOutletContext, useSearchParams, useSubmit } from '@remix-run/react'
import { ParticipationMethod } from '@prisma/client';

import { requireAdminId } from '~/session.server';
import usePresenceControl from './hooks/usePresenceControl';
import { changeObservation, handleCheckIn } from '~/models/credentials.server';
import { getCredentialsParticipantsList } from './utils/getCredentialsParticipantsList';

import Button from '~/components/button'
import TextField from '~/components/textfield';
import PopoverTrigger from '~/components/popover/trigger';
import Dialog from '~/components/dialog';
import { Radio, RadioGroup } from '~/components/radioGroup';
import { FiChevronDown, FiChevronLeft, FiChevronRight } from "react-icons/fi/index.js";
import { BsUpcScan } from "react-icons/bs/index.js";
import Checkbox from '~/components/checkbox';
import ModalTrigger from '~/components/modalOverlay/trigger';
import ChangeObservationModal from './components/changeObservationModal';
import Spinner from '~/components/spinner';
import BarcodeModal from './components/barcodeModal';

export const action = async ({ request }: ActionFunctionArgs) => {
  await requireAdminId(request)
  const formData = await request.formData();
  const participantId = formData.get("participantId") as string
  const observation = formData.get("observation") as string
  const checkin = formData.get("checkin")

  let participant

  if (typeof observation === "string" && observation !== null) {
    try {
      participant = await changeObservation(participantId, observation)
      console.log(participant)
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

  const participants = await getCredentialsParticipantsList(Number(searchIndex) ?? 0, participationMethod ?? "Escola", orderBy ?? "user", query as string)

  return json({ participants })
}

const Credentials = () => {
  const submit = useSubmit()
  const [searchParams] = useSearchParams()
  const { participationMethod } = useOutletContext<{ participationMethod: ParticipationMethod }>()
  const { participants } = useLoaderData<typeof loader>()
  const [checkInFetcherState, handleCheckin, userIdBeingCheckIn] = usePresenceControl()
  const formRef = React.useRef<HTMLFormElement>(null)

  return (
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

              <td className='table-cell'>
                FA
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
                      {checkInFetcherState !== "idle" && userIdBeingCheckIn === participant.id ?
                        <Spinner dim='18px' />
                        :
                        <Checkbox
                          name="check"
                          aria-label='check-presence'
                          defaultSelected={participant.presenceControl?.checked}
                          onChange={value => handleCheckin(participant.id, value)}
                        />
                      }
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
                      <ModalTrigger
                        isDismissable
                        buttonClassName={participant.presenceControl?.observation ? "default-button" : "secondary-button-box green-light"}
                        label={participant.presenceControl?.observation ?
                          <div style={{ maxWidth: "150px" }}>
                            <p className='text overflow'>
                              {participant.presenceControl?.observation}
                            </p>
                          </div> : "Adicionar"
                        }
                      >
                        {(close: () => void) => <ChangeObservationModal close={close} participant={participant as any} />}
                      </ModalTrigger>
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
                    {participant.delegation?.participants.find(p => p.leader)?.name}
                  </td>

                  <td className='table-cell'>
                    {participant.delegation?.participants.find(p => p.delegationAdvisor)?.name}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>


      <div className='admin-navigation-button-container'>
        <div>
          <ModalTrigger
            buttonClassName="secondary-button-box blue-light"
            label={<><BsUpcScan className='icon' /> Credenciamento diário</>}
          >
            {(close: () => void) => <BarcodeModal close={close} />}
          </ModalTrigger>
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
    </Form>
  )
}

export default Credentials

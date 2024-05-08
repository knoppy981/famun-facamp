import React from 'react'
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import { useFetcher, useLoaderData, useSearchParams, useSubmit } from '@remix-run/react'
import qs from 'qs'
import { ParticipationMethod } from '@prisma/client';

import { requireAdminId } from '~/session.server';
import { DelegationType, adminDelegationData } from '~/models/delegation.server';
import { iterateObject } from '../dashboard/utils/findDiffrences';
import { updateUserSchema } from '~/schemas';
import { getExistingUser, updateUser } from '~/models/user.server';
import { getCorrectErrorMessage } from '~/utils/error';

import Button from '~/components/button';
import Link from '~/components/link';
import { FiArrowLeft, FiAward, FiBell, FiDollarSign, FiFile, FiTrash2 } from "react-icons/fi/index.js";
import ModalTrigger from '~/components/modalOverlay/trigger';
import Dialog from '~/components/dialog';
import Spinner from '~/components/spinner';
import ParticipantModal from '../admin._dashboard/participantModal';
import { useParticipantModal } from '../admin._dashboard/participantModal/useParticipantModal';
import { useDelegationData } from './useDelegationData';
import { useOverlayTriggerState } from 'react-stately';
import ChangeMaxParticipants from './changeMaxParticipants';
import ChangeLeader from './changeLeader';

export const action = async ({ request }: ActionFunctionArgs) => {
  await requireAdminId(request)
  const formData = await request.formData();
  const userId = formData.get("userId") as string
  let changes = qs.parse(formData.get("changes") as string)
  let data: any = {}

  if (!userId) throw json({})

  iterateObject(changes, (key, value, path) => {
    if (value === "false" || value === "true") value = value === "true"
    if (key.includes('.')) {
      const [field, nestedField, nested2Field] = key.split('.')
      if (typeof data[field] === 'object' && data[field] !== null) {
        if (field === "foodRestrictions") {
          data[field]["upsert"]["create"][nestedField] = value ?? null;
          data[field]["upsert"]["update"][nestedField] = value ?? null;
        } else if (nestedField === "committee" && nested2Field === "id") {
          data[field]["update"][nestedField] = { connect: { id: value ?? null } }
        } else {
          data[field]["update"][nestedField] = value ?? null;
        }
      } else {
        if (field === "foodRestrictions") {
          data[field] = { upsert: { create: { [nestedField]: value ?? null }, update: { [nestedField]: value ?? null } } };
        } else if (nestedField === "committee" && nested2Field === "id") {
          data[field] = { update: { [nestedField]: { connect: { id: value ?? null } } } }
        } else {
          data[field] = { update: { [nestedField]: value ?? null } };
        }
      }
    } else {
      data[key] = value
    }
  });

  try {
    await updateUserSchema.validateAsync(data)
    await getExistingUser({
      name: data.name ?? "",
      email: data.email ?? "",
      cpf: data.cpf === "" ? undefined : data.cpf,
      rg: data.rg === "" ? undefined : data.rg,
      passport: data.passport === "" ? undefined : data.passport,
      userId: userId
    })
  } catch (error) {
    console.log(error)
    const [label, msg, group, path] = getCorrectErrorMessage(error)
    return json(
      { errors: { [label]: msg, errorGroup: group, path: path } },
      { status: 400 }
    );
  }

  return updateUser({ userId: userId, values: data })
}

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const participationMethod = url.searchParams.get("pm") as ParticipationMethod
  if (!params.delegation) return redirect(`/admin/delegations?pm=${participationMethod || "Escola"}`)

  const delegation = await adminDelegationData(params.delegation as string)

  if (!delegation) {
    return redirect(`/admin/delegations?pm=${participationMethod || "Escola"}`)
  }

  const amountPaid: { "usd": number, "brl": number } = { "usd": 0, "brl": 0 }
  delegation.participants.forEach(participant => {
    const amount = participant.stripePaid?.amount
    const currency = participant.stripePaid?.currency
    if (amount && currency) {
      if (currency) {
        amountPaid[currency.toLocaleLowerCase() as "usd" | "brl"] += parseInt(amount)
      } else {
        amountPaid[currency.toLocaleLowerCase() as "usd" | "brl"] = parseInt(amount)
      }
    }
  });

  if (!delegation || (participationMethod && delegation?.participationMethod !== participationMethod)) return redirect(`/admin/delegations?pm=${participationMethod}`)

  return json({ delegation: { ...delegation, amountPaid } })
}

const Delegation = () => {
  const { delegation } = useLoaderData<typeof loader>()
  const [searchParams] = useSearchParams()
  const [overlayState, selectedParticipantId, handleParticipantChange] = useParticipantModal()
  const [handleRemoveParticipant] = useDeleteDelegation()
  const [handlePostponePayment, postponePaymentState] = usePostponePayment()
  const [hasDelegates, participantLength, sentDocuments, paidParticipants, totalPaid] = useDelegationData(delegation)
  const changeMaxParticipantsState = useOverlayTriggerState({})
  const changeLeaderState = useOverlayTriggerState({})

  return (
    <div className='admin-container'>
      <div className='committee-return-link'>
        <Link
          to={{
            pathname: '/admin/delegations',
            search: searchParams.toString()
          }}
        >
          <FiArrowLeft className='icon' /> Voltar
        </Link>
      </div>

      <div className='committee-title'>
        {delegation.school}
      </div>

      <div className='admin-delegation-subtitle'>
        <div className="admin-delegation-subtitle-item">
          <span>{participantLength}</span> participante{participantLength !== 1 ? "s" : ""}
        </div>

        <div className="admin-delegation-subtitle-item">
          <span>{paidParticipants}</span> inscriç{paidParticipants !== 1 ? "ões" : "ão"} paga{paidParticipants !== 1 ? "s" : ""}
          {totalPaid !== "" ? ", total pago:" + totalPaid : ""}
        </div>

        <div className="admin-delegation-subtitle-item">
          <span>{sentDocuments}</span> participante{sentDocuments !== 1 ? "s" : ""} com documentos enviado{sentDocuments !== 1 ? "s" : ""}
        </div>
      </div>

      {hasDelegates ?
        <>
          <ParticipantModal state={overlayState} participant={delegation.participants.find(participant => participant.id === selectedParticipantId) as any} />

          <div className='overflow-container'>
            <table className='table'>
              <tbody>
                <tr className="table-row example">
                  <td className='table-cell'>
                    Participantes
                  </td>

                  <td className='table-cell' style={{ paddingLeft: "30px" }}>
                    Posição
                  </td>

                  <td className='table-cell'>
                    Comitê/Conselho
                  </td>

                  <td className='table-cell'>
                    Representação
                  </td>

                  <td className='table-cell'>
                    Entrou em
                  </td>
                </tr>

                {delegation.participants.map((participant, i) => {
                  const necessaryFiles = participant.delegate ? 2 : 1
                  const isDocumentsSent = participant.files?.filter((file) => file.name === "Liability Waiver" || file.name === "Position Paper").length === necessaryFiles
                  const isPaid = participant.stripePaid
                  const leader = participant.leader
                  const delegate = participant.delegate as any

                  return (
                    <tr
                      className="table-row cursor"
                      key={i}
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
                          <FiFile className='icon' color={isDocumentsSent ? "green" : "red"} />
                          <FiDollarSign className='icon' color={isPaid ? "green" : "red"} />
                          {participant.name}
                          {participant.notifications.filter(notification => !notification.seen).length > 0 ?
                            <div className='notification'><FiBell className='icon notification' /></div> : null
                          }
                          {leader && <div className="secondary-button-box red-light"><div className='button-child'>Chefe da Delegação</div></div>}
                        </div>
                      </td>

                      <td className='table-cell'>
                        <div className='table-flex-cell'>
                          <div className={`secondary-button-box ${participant.delegate ? 'blue-light' : 'green-light'}`}>
                            <div className='button-child'>
                              {participant.delegate ? "Delegado" : participant?.delegationAdvisor?.advisorRole}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className='table-cell'>
                        {participant.delegate ? delegate?.committee?.council.replace(/_/g, " ") ?? <p className='text italic'>Não definido</p> : ""}
                      </td>

                      <td className='table-cell'>
                        {participant.delegate ? participant.delegate.country ?? <p className='text italic'>Não definido</p> : ""}
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
        </>
        :
        <div className='committee-title'>
          <div className='text italic'>
            Ainda não há delegados nesta conferência
          </div>
        </div>
      }
      <div className='committee-title'>
        <div className='text'>
          Limite para o pagamento: {new Date(delegation.paymentExpirationDate).toLocaleString('pt-BR', {
            timeZone: 'America/Sao_Paulo',
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
          })}
        </div>

        <Button
          className="secondary-button-box green-light"
          isDisabled={!delegation}
          onPress={() => handlePostponePayment(delegation.id)}
        >
          {postponePaymentState !== 'idle' && <Spinner dim="18px" color='green' />}
          Adiar Pagamento
        </Button>
      </div>

      <div className='committee-title'>
        <div className='text'>
          Limite de delegados: {delegation.maxParticipants}
        </div>

        <Button
          className="secondary-button-box green-light"
          isDisabled={!delegation}
          onPress={changeMaxParticipantsState.toggle}
        >
          Alterar o Máximo de Delegados
        </Button>
      </div>

      <ChangeMaxParticipants state={changeMaxParticipantsState} maxParticipants={delegation.maxParticipants} delegationId={delegation.id} />

      <div className='committee-title'>
        <Button
          className="secondary-button-box blue-light"
          isDisabled={!delegation}
          onPress={changeLeaderState.toggle}
        >
          <FiAward className='icon' /> Designar novo Líder
        </Button>
      </div>

      <ChangeLeader state={changeLeaderState} delegation={delegation as any} />

      <div className='committee-title'>
        <ModalTrigger
          buttonClassName='secondary-button-box red-light'
          label={<><FiTrash2 className='icon' /> Excluír Delegação</>}
        >
          {(close: () => void) =>
            <Dialog maxWidth>
              <div className="dialog-title">
                Tem certeza que deseja excluír essa delegação?
              </div>

              <div className="dialog-subitem">
                Obs: Todos os participantes presentes nesta delegação ficaram sem delegação, os dados da delegação como o endereço e número para contato seram perdidos. <br />
                É importante ressaltar que delegados presentes nessa delegação que já foram designados para algum comitê/conselho continuaram designados.
              </div>

              <Button
                className="secondary-button-box red-dark"
                onPress={() => {
                  close()
                }}
              >
                Cancelar
              </Button>

              <Button
                className="secondary-button-box blue-dark"
                onPress={() => {
                  close()
                  handleRemoveParticipant(delegation.id)
                }}
              >
                <FiTrash2 className='icon' /> Excluír Delegação
              </Button>
            </Dialog>
          }
        </ModalTrigger>
      </div>
    </div >
  )
}

function useDeleteDelegation() {
  const submit = useSubmit()

  const handleRemoveParticipant = (delegationId: string) => {
    submit(
      { delegationId },
      { method: "post", action: "/api/admin/delegation/delete", navigate: false }
    )
  }

  return [handleRemoveParticipant]
}

function usePostponePayment(): [(delegationId: string) => void, "idle" | "loading" | "submitting"] {
  const fetcher = useFetcher()

  const handlePostponePayment = (delegationId: string) => {
    fetcher.submit(
      { delegationId },
      { method: "post", action: "/api/admin/delegation/paymentDue", navigate: false }
    )
  }

  return [handlePostponePayment, fetcher.state]
}

export default Delegation

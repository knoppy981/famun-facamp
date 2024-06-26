import React from 'react'
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import { useFetcher, useLoaderData, useSearchParams } from '@remix-run/react'
import qs from 'qs'
import { ParticipationMethod } from '@prisma/client';

import { requireAdminId } from '~/session.server';
import { adminDelegationData } from '~/models/delegation.server';
import { iterateObject } from '../dashboard/utils/findDiffrences';
import { updateUserSchema } from '~/schemas';
import { getExistingUser, updateUser } from '~/models/user.server';
import { getCorrectErrorMessage } from '~/utils/error';

import Button from '~/components/button';
import Link from '~/components/link';
import { FiArrowLeft, FiAward, FiBell, FiDollarSign, FiFile, FiTrash2, FiUserMinus } from "react-icons/fi/index.js";
import ModalTrigger from '~/components/modalOverlay/trigger';
import Spinner from '~/components/spinner';
import ParticipantModal from '../admin._dashboard/components/participantModal';
import { useParticipantModal } from '../admin._dashboard/hooks/useParticipantModal';
import ChangeMaxParticipantsModal from './components/changeMaxParticipantsModal';
import ChangeLeaderModal from './components/changeLeaderModal';
import RemoveParticipantsModal from './components/removeParticipantsModal';
import DeleteDelegationModal from './components/deleteDelegationModal';
import viewDelegationData from './utils/viewDelegationData';

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
      data[key] = typeof value === "string" ? value.trim() : value
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
  const [handlePostponePayment, postponePaymentState] = usePostponePayment()
  const [hasDelegates, participantLength, sentDocuments, paidParticipants, totalPaid] = viewDelegationData(delegation)

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
                        {participant.delegate ? delegate?.committee?.name ?? <p className='text italic'>Não definido</p> : ""}
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

        <ModalTrigger
          isDismissable
          buttonClassName="secondary-button-box green-light"
          isDisabled={!delegation}
          label="Alterar o Máximo de Delegados"
        >
          {(close: () => void) =>
            <ChangeMaxParticipantsModal
              close={close}
              maxParticipants={delegation.maxParticipants}
              delegationId={delegation.id}
              participantsCount={delegation.participants.filter(p => p.delegate).length ?? 1}
            />
          }
        </ModalTrigger>
      </div>

      <div className='committee-title'>
        <ModalTrigger
          isDismissable
          buttonClassName="secondary-button-box blue-light"
          isDisabled={!delegation}
          label={<><FiAward className='icon' /> Designar novo Líder</>}
        >
          {(close: () => void) => <ChangeLeaderModal close={close} delegation={delegation as any} />}
        </ModalTrigger>
      </div>

      <div className='committee-title'>
        <ModalTrigger
          isDismissable
          buttonClassName="secondary-button-box red-light"
          isDisabled={!delegation}
          label={<><FiUserMinus className='icon' /> Remover Participantes</>}
        >
          {(close: () => void) => <RemoveParticipantsModal close={close} delegation={delegation as any} />}
        </ModalTrigger>
      </div>

      <div className='committee-title'>
        <ModalTrigger
          buttonClassName='secondary-button-box red-light'
          label={<><FiTrash2 className='icon' /> Excluír Delegação</>}
        >
          {(close: () => void) => <DeleteDelegationModal close={close} delegationId={delegation.id} />}
        </ModalTrigger>
      </div>
    </div >
  )
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

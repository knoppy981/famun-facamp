import React from 'react'
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import { useLoaderData, useOutletContext, useSearchParams, useSubmit } from '@remix-run/react'
import qs from 'qs'
import { ParticipationMethod } from '@prisma/client';
import { useOverlayTriggerState } from 'react-stately';

import { requireAdminId } from '~/session.server';

import Button from '~/components/button';
import Link from '~/components/link';
import { FiArrowLeft, FiBell, FiDollarSign, FiDownload, FiFile, FiTrash2 } from "react-icons/fi/index.js";
import { delegationAoo } from '~/sheets/data';
import { exportAoo } from '~/sheets';
import { DelegationType, adminDelegationData } from '~/models/delegation.server';
import { getDelegationCharges } from '~/stripe.server';
import ParticipantModal from './participant';
import { iterateObject } from '../dashboard/utils/findDiffrences';
import { updateUserSchema } from '~/schemas';
import { getExistingUser, updateUser } from '~/models/user.server';
import { getCorrectErrorMessage } from '~/utils/error';
import ModalTrigger from '~/components/modalOverlay/trigger';
import Dialog from '~/components/dialog';

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
        } else if (nestedField === "comittee" && nested2Field === "id") {
          data[field]["update"][nestedField] = { connect: { id: value ?? null } }
        } else {
          data[field]["update"][nestedField] = value ?? null;
        }
      } else {
        if (field === "foodRestrictions") {
          data[field] = { upsert: { create: { [nestedField]: value ?? null }, update: { [nestedField]: value ?? null } } };
        } else if (nestedField === "comittee" && nested2Field === "id") {
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
  if (!params.delegation) return redirect(`/admin/delegations?pm=${participationMethod}`)

  const delegation = await adminDelegationData(params.delegation as string)

  if (!delegation) {
    return redirect(`/admin/delegations?pm=${participationMethod}`)
  }

  const delegationCharges = await getDelegationCharges(delegation as any)
  const amountPaid: { "usd": number, "brl": number } = { "usd": 0, "brl": 0 }
  delegationCharges?.data.forEach(charge => {
    if (amountPaid[charge.currency as "usd" | "brl"]) {
      amountPaid[charge.currency as "usd" | "brl"] += charge.amount
    } else {
      amountPaid[charge.currency as "usd" | "brl"] = charge.amount
    }
  });

  if (!delegation || (participationMethod && delegation?.participationMethod !== participationMethod)) return redirect(`/admin/delegations?pm=${participationMethod}`)

  return json({ delegation: { ...delegation, amountPaid } })
}

const Delegation = () => {
  const { delegation } = useLoaderData<typeof loader>()
  const [searchParams] = useSearchParams()
  const { participationMethod } = useOutletContext<{ participationMethod: ParticipationMethod }>()
  const [selectedParticipant, setSelectedParticipant] = React.useState<any>()
  const overlayState = useOverlayTriggerState({})
  const hasDelegates = delegation.participants.length > 0
  const sentDocuments = delegation.participants?.reduce((accumulator, participant) => {
    if (participant.delegate) {
      if (participant.files?.filter(file => file.name === "Liability Waiver" || file.name === "Position Paper").length === 2) accumulator += 1
    } else if (participant.delegationAdvisor) {
      if (participant.files?.filter(file => file.name === "Liability Waiver").length === 1) accumulator += 1
    }
    return accumulator
  }, 0) as number
  const paidParticipants = delegation.participants?.reduce((accumulator, participant) => {
    if (participant.stripePaidId) accumulator += 1
    return accumulator
  }, 0) as number
  const [handleRemoveParticipant] = useDeleteDelegation()

  const totalPaid = `
  ${delegation.amountPaid.brl > 0 ? (delegation.amountPaid.brl / 100).toLocaleString("pt-BR", { style: "currency", currency: "brl" }) : ""}
  ${delegation.amountPaid.usd > 0 ? (delegation.amountPaid.usd / 100).toLocaleString("pt-BR", { style: "currency", currency: "usd" }) : ""}
  `

  return (
    <div className='admin-container'>
      <div className='comittee-return-link'>
        <Link
          to={{
            pathname: '/admin/delegations',
            search: searchParams.toString()
          }}
        >
          <FiArrowLeft className='icon' /> Voltar
        </Link>
      </div>

      <div className='comittee-title'>
        {delegation.school}
      </div>

      <div className='admin-delegation-subtitle'>
        <div className="admin-delegation-subtitle-item">
          <span>{delegation?.participants?.length}</span> participante{delegation?.participants?.length !== 1 ? "s" : ""}
        </div>

        <div className="admin-delegation-subtitle-item">
          <span>{paidParticipants}</span> inscriç{paidParticipants !== 1 ? "ões" : "ão"} paga{paidParticipants !== 1 ? "s, " : ", "}
          total pago: {totalPaid}
        </div>

        <div className="admin-delegation-subtitle-item">
          <span>{sentDocuments}</span> participante{sentDocuments !== 1 ? "s" : ""} com documentos enviado{sentDocuments !== 1 ? "s" : ""}
        </div>
      </div>

      {hasDelegates ?
        <>
          <ParticipantModal state={overlayState} participant={selectedParticipant} />

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
                    Conselho
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
                  const isPaid = participant.stripePaidId
                  const leader = participant.leader
                  const delegate = participant.delegate as any

                  return (
                    <tr
                      className="table-row cursor"
                      key={i}
                      onClick={() => {
                        setSelectedParticipant(participant)
                        overlayState.toggle()
                      }}
                      tabIndex={0}
                      role="link"
                      aria-label={`Change representation for ${" "}`}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === 'Space') {
                          event.preventDefault();
                          setSelectedParticipant(participant)
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
                        </div>
                      </td>

                      <td className='table-cell'>
                        <div className='table-flex-cell'>
                          <div className={`secondary-button-box ${participant.delegate ? 'blue-light' : 'green-light'}`}>
                            <div>
                              {participant.delegate ? "Delegado" : participant?.delegationAdvisor?.advisorRole}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className='table-cell'>
                        {participant.delegate ? delegate?.comittee?.council.replace(/_/g, " ") ?? <p className='text italic'>Não definido</p> : ""}
                      </td>

                      <td className='table-cell'>
                        {participant.delegate ? participant.delegate.country ?? <p className='text italic'>Não definido</p> : ""}
                      </td>

                      <td className='table-cell'>
                        {new Date(participant.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
        :
        <div className='comittee-title'>
          <div className='text italic'>
            Ainda não há delegados nesta conferência
          </div>
        </div>
      }
      <div className='comittee-title'>
        <Button
          className="secondary-button-box green-light"
          isDisabled={!delegation}
          onPress={() => {
            if (delegation !== null) {
              let aoo = delegationAoo({
                ...delegation,
                address: delegation.address ? delegation.address : undefined,
                createdAt: new Date(delegation.createdAt as any),
                paymentExpirationDate: new Date(delegation.paymentExpirationDate as any),
                updatedAt: new Date(),
                participants: delegation.participants as any
              }, `${totalPaid}`)

              exportAoo(aoo, delegation.school as string)
            }
          }}
        >
          <FiDownload className='icon' /> Planilha
        </Button>
      </div>

      <div className='comittee-title'>
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
      { method: "post", action: "/api/adminDeleteDelegation", navigate: false }
    )
  }

  return [handleRemoveParticipant]
}

export default Delegation

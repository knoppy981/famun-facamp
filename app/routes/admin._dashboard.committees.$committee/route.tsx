import React from 'react'
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import { useLoaderData, useOutletContext, useSearchParams } from '@remix-run/react'
import qs, { ParsedQs } from 'qs'
import { ParticipationMethod } from '@prisma/client';

import { addDelegatesToCommittee, getCommitteeByName, removeDelegates } from '~/models/committee.server';
import { requireAdminId } from '~/session.server';

import Button from '~/components/button';
import Link from '~/components/link';
import AddParticipantModal from './components/addParticipantModal';
import ChangeRepresentation from './components/changeRepresentationModal';
import { FiArrowLeft, FiDownload, FiTrash2, FiUserMinus, FiUserPlus } from "react-icons/fi/index.js";
import { changeDelegateRepresentation } from '~/models/delegate.server';
import { isoCountries } from '~/lib/ISO-3661-1';
import DeleteCommitteeModal from './components/deleteCommitteeModal';
import { exportAoo } from '~/sheets';
import { committeeAoo } from './utils/aoo';
import { getExtraRepresentations } from '~/models/configuration.server';
import ModalTrigger from '~/components/modalOverlay/trigger';
import RemoveParticipantsModal from './components/removeParticipantsModal';

interface ExtendedParsedQs extends ParsedQs {
  ids: string[];
  committeeId: string;
}

export const action = async ({ request }: ActionFunctionArgs) => {
  await requireAdminId(request)

  const text = await request.text()
  const { ids, committeeId, delegateId, country, actionType, ...rest } = qs.parse(text) as ExtendedParsedQs

  if (ids && committeeId && actionType) {
    let committee

    try {
      if (actionType === "add") {
        committee = await addDelegatesToCommittee(committeeId as string, ids.map(item => ({ id: item })))
      } else {
        committee = await removeDelegates(committeeId as string, ids.map(item => ({ id: item })))
      }
    } catch (error) {
      console.log(error)
      return json(
        { errors: { add: error } },
        { status: 400 }
      );
    }

    return json({ committee })

  } else if (delegateId && country) {
    let delegate

    try {
      delegate = await changeDelegateRepresentation(delegateId as string, country as string)
    } catch (error) {
      console.log(error)
      return json(
        { errors: { representation: error } },
        { status: 400 }
      );
    }

    return json({ delegate })
  }

  throw json({})
}

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const participationMethod = url.searchParams.get("pm") as ParticipationMethod

  if (!params.committee) return redirect(`/admin/committees?pm=${participationMethod}`)
  const committee = await getCommitteeByName(params.committee as string)
  const configurations = await getExtraRepresentations()

  if (!committee || (participationMethod && committee?.type !== participationMethod)) return redirect(`/admin/committees?pm=${participationMethod}`)

  return json({ committee, representations: configurations?.representacoesExtras })
}

export type CommitteeType = {
  delegates: {
    id: string;
    country: string | null;
    user: {
      name: string;
      sex: "Masculino" | "Feminino";
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
  }[];
  id: string;
  council: string;
  type: ParticipationMethod;
  name: string;
  createdAt: string;
}

const Committee = () => {
  const { committee, representations } = useLoaderData<typeof loader>()
  const [searchParams] = useSearchParams()
  const { participationMethod } = useOutletContext<{ participationMethod: ParticipationMethod }>()
  const hasDelegates = committee.delegates.length > 0

  return (
    <div className='admin-container'>
      <div className='committee-return-link'>
        <Link
          to={{
            pathname: '/admin/committees',
            search: searchParams.toString()
          }}
        >
          <FiArrowLeft className='icon' /> Voltar
        </Link>
      </div>

      <div className='committee-title'>
        {committee.name}

        <ModalTrigger
          isDismissable
          buttonClassName="secondary-button-box blue-light"
          label={<><FiUserPlus className='icon' /> Adicionar Delegados</>}
        >
          {(close: () => void) => <AddParticipantModal close={close} committee={committee as CommitteeType} participationMethod={participationMethod} />}
        </ModalTrigger>
      </div>
      <div className='committee-title'>
        <p className='text italic'>{committee.council}</p>
      </div>

      {hasDelegates ?
        <div className='overflow-container'>
          <table className='table'>
            <tbody>
              <tr className="table-row example">
                <td className='table-cell'>
                  {committee.name}
                </td>

                <td className='table-cell'>
                  {participationMethod}
                </td>

                <td className='table-cell'>
                  Nome
                </td>

                <td className='table-cell'>
                  Head Delegate
                </td>

                <td className='table-cell'>
                  Position Paper
                </td>

                <td className='table-cell'>
                  Sexo
                </td>
              </tr>

              {committee.delegates.map((delegate, i) => (
                <tr
                  className="table-row"
                  key={i}
                  /* onClick={() => {
                    changeRepresentationState.toggle()
                    setSelectedDelegate(delegate)
                  }} */
                  tabIndex={0}
                  role="link"
                  aria-label={`Change representation for ${delegate.user.name}`}
                  /* onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === 'Space') {
                      event.preventDefault();
                      changeRepresentationState.toggle()
                      setSelectedDelegate(delegate)
                    }
                  }} */
                >
                  <td className='table-cell'>
                    <div className='table-flex-cell'>
                      <ModalTrigger
                        isDismissable
                        label={delegate.country ?
                          <><div className={`flag-icon flag-icon-${isoCountries[delegate.country]?.toLowerCase()}`} style={{ fontSize: "2rem" }} />{delegate.country}</>
                          :
                          <p className='text italic'>Escolher reprentação</p>
                        }
                      >
                        {(close: () => void) =>
                          <ChangeRepresentation
                            close={close}
                            committee={committee as CommitteeType}
                            participationMethod={participationMethod}
                            selectedDelegate={delegate}
                            representations={representations}
                          />
                        }
                      </ModalTrigger>

                    </div>
                  </td>

                  <td className='table-cell'>
                    {delegate.user.delegation?.school}
                  </td>

                  <td className='table-cell'>
                    {delegate.user.name}
                  </td>

                  <td className='table-cell'>
                    {delegate.user.delegation?.participants[0]?.name}
                  </td>

                  <td className='table-cell'>
                    {delegate.user._count.files > 0 ? "Entregue" : <p className='text italic'>Não Entregue</p>}
                  </td>

                  <td className='table-cell'>
                    {delegate.user.sex}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        :
        <div className='committee-title'>
          <div className='text italic'>
            Ainda não há delegados nesta conferência
          </div>
        </div>
      }
      <div className='committee-title'>
        <Button
          className='secondary-button-box green-light'
          onPress={() => {
            let aoo = committeeAoo(committee as CommitteeType)

            exportAoo(aoo, committee.name)
          }}
        >
          <FiDownload className='icon' /> Planilha
        </Button>
      </div>

      <div className='committee-title'>
        <ModalTrigger
          isDismissable
          buttonClassName="secondary-button-box red-light"
          label={<><FiUserMinus className='icon' /> Remover Delegados</>}
        >
          {(close: () => void) => <RemoveParticipantsModal close={close} committee={committee as CommitteeType} />}
        </ModalTrigger>
      </div>

      <div className='committee-title'>
        <ModalTrigger
          isDismissable
          buttonClassName="secondary-button-box red-light"
          label={<><FiTrash2 className='icon' /> Excluír Conferência</>}
        >
          {(close: () => void) => <DeleteCommitteeModal close={close} committee={committee as CommitteeType} />}
        </ModalTrigger>
      </div>
    </div >
  )
}


export default Committee

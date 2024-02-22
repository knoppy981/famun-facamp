import React from 'react'
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import { useLoaderData, useOutletContext, useSearchParams } from '@remix-run/react'
import qs, { ParsedQs } from 'qs'
import { Council, ParticipationMethod } from '@prisma/client';
import { useOverlayTriggerState } from 'react-stately';

import { addDelegatesToComittee, getComitteeByName, removeDelegates } from '~/models/committee.server';
import { requireAdminId } from '~/session.server';

import Button from '~/components/button';
import Link from '~/components/link';
import AddParticipant from './addParticipant';
import ChangeRepresentation from './changeRepresentation';
import { FiArrowLeft, FiDownload, FiTrash2, FiUserMinus, FiUserPlus } from "react-icons/fi/index.js";
import { changeDelegateRepresentation } from '~/models/delegate.server';
import { isoCountries } from '~/lib/ISO-3661-1';
import DeleteComittee from './deleteComittee';
import RemoveParticipant from './removeParticipant';
import { comitteeAoo } from '~/sheets/data';
import { exportAoo } from '~/sheets';

interface ExtendedParsedQs extends ParsedQs {
  ids: string[];
  comitteeId: string;
}

export const action = async ({ request }: ActionFunctionArgs) => {
  await requireAdminId(request)

  const text = await request.text()
  const { ids, comitteeId, delegateId, country, actionType, ...rest } = qs.parse(text) as ExtendedParsedQs

  if (ids && comitteeId && actionType) {
    let comittee

    try {
      if (actionType === "add") {
        comittee = await addDelegatesToComittee(comitteeId as string, ids.map(item => ({ id: item })))
      } else {
        comittee = await removeDelegates(comitteeId as string, ids.map(item => ({ id: item })))
      }
    } catch (error) {
      console.log(error)
      return json(
        { errors: { add: error } },
        { status: 400 }
      );
    }

    return json({ comittee })

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

  if (!params.comittee) return redirect(`/admin/comittees?pm=${participationMethod}`)
  const comittee = await getComitteeByName(params.comittee as string)

  if (!comittee || (participationMethod && comittee?.type !== participationMethod)) return redirect(`/admin/comittees?pm=${participationMethod}`)

  return json({ comittee })
}

export type ComitteeType = {
  delegates: {
    id: string;
    country: string | null;
    user: {
      name: string;
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
  council: Council;
  type: ParticipationMethod;
  name: string;
  createdAt: string;
}

const Comittee = () => {
  const { comittee } = useLoaderData<typeof loader>()
  const [searchParams] = useSearchParams()
  const { participationMethod } = useOutletContext<{ participationMethod: ParticipationMethod }>()
  const addUserState = useOverlayTriggerState({})
  const changeRepresentationState = useOverlayTriggerState({})
  const deleteComitteeState = useOverlayTriggerState({})
  const removeParticipantState = useOverlayTriggerState({})
  const [selectedDelegate, setSelectedDelegate] = React.useState<typeof comittee.delegates[0]>()
  const hasDelegates = comittee.delegates.length > 0

  return (
    <div className='admin-container'>
      <div className='comittee-return-link'>
        <Link
          to={{
            pathname: '/admin/comittees',
            search: searchParams.toString()
          }}
        >
          <FiArrowLeft className='icon' /> Voltar
        </Link>
      </div>

      <div className='comittee-title'>
        {comittee.name}

        <Button className='secondary-button-box blue-light' onPress={addUserState.toggle}>
          <FiUserPlus className='icon' /> Adicionar Delegados
        </Button>
      </div>

      <AddParticipant state={addUserState} comittee={comittee} participationMethod={participationMethod} />

      <ChangeRepresentation state={changeRepresentationState} comittee={comittee} participationMethod={participationMethod} selectedDelegate={selectedDelegate} />

      <DeleteComittee state={deleteComitteeState} comittee={comittee} />

      <RemoveParticipant state={removeParticipantState} comittee={comittee} />

      {hasDelegates ?
        <div className='overflow-container'>
          <table className='table'>
            <tbody>
              <tr className="table-row example">
                <td className='table-cell'>
                  {comittee.name}
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

              {comittee.delegates.map((delegate, i) => (
                <tr
                  className="table-row cursor"
                  key={i}
                  onClick={() => {
                    changeRepresentationState.toggle()
                    setSelectedDelegate(delegate)
                  }}
                  tabIndex={0}
                  role="link"
                  aria-label={`Change representation for ${delegate.user.name}`}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === 'Space') {
                      event.preventDefault();
                      changeRepresentationState.toggle()
                      setSelectedDelegate(delegate)
                    }
                  }}
                >
                  <td className='table-cell'>
                    {delegate.country ?
                      <div className='table-flex-cell'>
                        <div className={`flag-icon flag-icon-${isoCountries[delegate.country]?.toLowerCase()}`} style={{ fontSize: "2rem" }} />
                        {delegate.country}
                      </div>
                      :
                      <p className='text italic'>Escolher reprentação</p>
                    }
                  </td>

                  <td className='table-cell'>
                    {delegate.user.delegation?.school}
                  </td>

                  <td className='table-cell'>
                    {delegate.user.name}
                  </td>

                  <td className='table-cell'>
                    {delegate.user.delegation?.participants[0].name}
                  </td>

                  <td className='table-cell'>
                    {delegate.user._count.files > 0 ? "Entregue" : <p className='text italic'>Não Entregue</p>}
                  </td>

                  <td className='table-cell'>
                    Masculino
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        :
        <div className='comittee-title'>
          <div className='text italic'>
            Ainda não há delegados nesta conferência
          </div>
        </div>
      }
      <div className='comittee-title'>
        <Button
          className='secondary-button-box green-light'
          onPress={() => {
            let aoo = comitteeAoo(comittee)

            exportAoo(aoo, comittee.name)
          }}
        >
          <FiDownload className='icon' /> Planilha
        </Button>
      </div>

      <div className='comittee-title'>
        <Button className='secondary-button-box red-light' onPress={() => removeParticipantState.toggle()}>
          <FiUserMinus className='icon' /> Remover Delegados
        </Button>
      </div>

      <div className='comittee-title'>
        <Button className='secondary-button-box red-light' onPress={() => deleteComitteeState.toggle()}>
          <FiTrash2 className='icon' /> Escluír Conferência
        </Button>
      </div>
    </div >
  )
}


export default Comittee

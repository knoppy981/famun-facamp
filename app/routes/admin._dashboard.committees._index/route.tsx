import React from 'react'
import { ActionFunctionArgs, LoaderFunctionArgs, json } from '@remix-run/node';
import { Form, useLoaderData, useOutletContext, useSearchParams, useSubmit } from '@remix-run/react';
import qs from 'qs'
import { ParticipationMethod } from '@prisma/client';

import { createCommittee, getCommitteesList, getExistingCommittee } from '~/models/committee.server';
import { committeeSchema } from '~/schemas';
import { getCorrectErrorMessage } from '~/utils/error';

import TextField from '~/components/textfield';
import Link from '~/components/link';
import CreateCommitteeModal from './components/createCommitteeModal';
import { FiPlus, FiUser } from 'react-icons/fi/index.js';
import { getCouncils, getExtraRepresentations } from '~/models/configuration.server';
import ModalTrigger from '~/components/modalOverlay/trigger';

export const action = async ({ request }: ActionFunctionArgs) => {
  const text = await request.text()
  const { ...data } = qs.parse(text)
  let committee

  try {
    await committeeSchema.validateAsync(data)
    await getExistingCommittee(data?.name as string)
  } catch (error) {
    const [label, msg] = getCorrectErrorMessage(error)
    console.log(error)
    return json(
      { errors: { [label]: msg } },
      { status: 400 }
    );
  }

  try {
    committee = await createCommittee(data as any)
  } catch (error) {
    console.log(error)
    return json(
      { errors: { error } },
      { status: 400 }
    );
  }


  return json({ committee })
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("committee-search");
  const participationMethod = url.searchParams.get("pm") as ParticipationMethod

  const committees = await getCommitteesList(participationMethod ?? "Escola", query as string)
  const configurations = await getExtraRepresentations()
  const councils = await getCouncils(participationMethod ?? "Escola")

  return json({ committees, councilOptions: councils, representations: configurations?.representacoesExtras })
}

const route = () => {
  const submit = useSubmit()
  const [searchParams] = useSearchParams()
  const formRef = React.useRef<HTMLFormElement>(null)
  const { participationMethod } = useOutletContext<{ participationMethod: ParticipationMethod }>()
  const { committees, councilOptions } = useLoaderData<typeof loader>()

  return (
    <div className='admin-container'>
      <Form ref={formRef}>
        <div className='admin-search-container'>
          <TextField
            className="admin-search-input-box"
            name="committee-search"
            aria-label="Procurar"
            type="text"
            isRequired
            onChange={() => {
              const formData = new FormData(formRef.current ?? undefined);
              submit(formData, { method: "GET", preventScrollReset: true })
            }}
            defaultValue={searchParams.get("committee-search") ?? ""}
            placeholder='Procurar...'
          />
        </div>

        <input type='hidden' name='pm' value={participationMethod} />
      </Form >

      <div className='committee-container'>
        {committees?.map((item, index) => (
          <Link
            prefetch='intent'
            className='committee-item link' key={index}
            to={{
              pathname: item.name,
              search: searchParams.toString(),
            }}
          >
            <div className='committee-item-title'>
              <div style={{ maxWidth: "600px" }}>
                <p className='text overflow'>
                  {item.name}
                </p>
              </div>

              {item._count.delegates > 0 ?
                <div>
                  <FiUser className='icon' />

                  {item._count.delegates}
                </div>
                : null
              }
            </div>

            <p className='text italic'>{item.council.replace(/_/g, " ")}</p>
          </Link>
        ))}

        <ModalTrigger
          isDismissable
          buttonClassName={"committee-item add"}
          label={
            <div className='committee-item-title add'>
              Adicionar Conferência <FiPlus className='icon' />
            </div>
          }
        >
          {(close: () => void) => <CreateCommitteeModal close={close} participationMethod={participationMethod} councilOptions={councilOptions} />}
        </ModalTrigger>
      </div>
    </div>
  )
}

export default route

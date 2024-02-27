import React from 'react'
import { ActionFunctionArgs, LoaderFunctionArgs, json } from '@remix-run/node';
import { FetcherWithComponents, Form, useFetcher, useLoaderData, useOutletContext, useSearchParams, useSubmit } from '@remix-run/react';
import qs from 'qs'
import { ParticipationMethod } from '@prisma/client';

import { createComittee, getComitteesList } from '~/models/comittee.server';
import { ComitteeList } from './types';
import { comitteeSchema } from '~/schemas';
import { getCorrectErrorMessage } from '~/utils/error';

import TextField from '~/components/textfield';
import Link from '~/components/link';
import Button from '~/components/button';
import CreateComittee from './createComittee';
import { FiPlus, FiUser } from 'react-icons/fi/index.js';
import { useOverlayTriggerState } from 'react-stately';

export const action = async ({ request }: ActionFunctionArgs) => {
  const text = await request.text()
  const { ...data } = qs.parse(text)

  try {
    await comitteeSchema.validateAsync(data)
  } catch (error) {
    const [label, msg] = getCorrectErrorMessage(error)
    console.log(error)
    return json(
      { errors: { [label]: msg } },
      { status: 400 }
    );
  }

  const comittee = await createComittee(data as any)

  return json({ comittee })
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("comittee-search");
  const participationMethod = url.searchParams.get("pm") as ParticipationMethod

  const comittees = await getComitteesList(participationMethod ?? "Escola", query as string)

  return json({ comittees })
}

const route = () => {
  const submit = useSubmit()
  const [searchParams] = useSearchParams()
  const formRef = React.useRef<HTMLFormElement>(null)
  const { participationMethod } = useOutletContext<{ participationMethod: ParticipationMethod }>()
  const { comittees } = useLoaderData<typeof loader>()
  const state = useOverlayTriggerState({})

  return (
    <div className='admin-container'>
      <Form ref={formRef} onChange={e => { submit(e.currentTarget, { method: "GET" }) }}>
        <div className='admin-search-container'>
          <TextField
            className="admin-search-input-box"
            name="comittee-search"
            aria-label="Procurar"
            type="text"
            isRequired
            placeholder='Procurar...'
          />
        </div>

        <input type='hidden' name="pm" value={participationMethod} />
      </Form >

      <div className='comittee-container'>
        {comittees?.map((item, index) => (
          <Link
            prefetch='intent'
            className='comittee-item' key={index}
            to={{
              pathname: item.name,
              search: searchParams.toString(),
            }}
          >
            <div className='comittee-item-title'>
              {item.name}

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

        <Button className='comittee-item add' onPress={state.toggle}>
          <div className='comittee-item-title add'>
            Adicionar Conferência <FiPlus className='icon' />
          </div>
        </Button>

        <CreateComittee state={state} participationMethod={participationMethod} />
      </div>
    </div>
  )
}

export default route

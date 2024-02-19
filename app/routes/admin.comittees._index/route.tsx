import React from 'react'
import { ActionFunctionArgs, LoaderFunctionArgs, json } from '@remix-run/node';
import { FetcherWithComponents, Form, useFetcher, useLoaderData, useOutletContext, useSearchParams } from '@remix-run/react';
import qs from 'qs'
import { ParticipationMethod } from '@prisma/client';

import { createComittee, getCommitteesList } from '~/models/committee.server';
import { ComitteeList } from './types';
import { comitteeSchema } from '~/schemas';
import { getCorrectErrorMessage } from '~/utils/error';

import TextField from '~/components/textfield';
import Link from '~/components/link';
import Button from '~/components/button';
import { useCreateComittee } from './useCreateComittee';
import CreateComittee from './createComittee';
import { FiPlus, FiUser } from 'react-icons/fi/index.js';

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

  console.log(comittee)

  return json({ comittee })
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("comittee-search");
  const participationMethod = url.searchParams.get("pm") as ParticipationMethod

  const comittees = await getCommitteesList(participationMethod ?? "Escola", query as string)

  return json({ comittees })
}

const route = () => {
  const fetcher = useFetcher<any>()
  const [searchParams] = useSearchParams()
  const formRef = React.useRef<HTMLFormElement>(null)
  const { participationMethod } = useOutletContext<{ participationMethod: ParticipationMethod }>()
  const { comittees: _comittees } = useLoaderData<typeof loader>()
  const [comittees] = useComitteesList(fetcher, participationMethod, _comittees, formRef)
  const createFetcher = useFetcher<any>()
  const [state, openModal] = useCreateComittee(createFetcher)

  return (
    <div className='admin-container'>
      <Form ref={formRef} onChange={e => { fetcher.submit(e.currentTarget, { method: "GET" }) }}>
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

        <Button className='comittee-item add' onPress={openModal}>
          <div className='comittee-item-title add'>
            Adicionar Conferência <FiPlus className='icon' />
          </div>
        </Button>

        <CreateComittee state={state} fetcher={createFetcher} participationMethod={participationMethod} />
      </div>
    </div>
  )
}

function useComitteesList(fetcher: FetcherWithComponents<any>, participationMethod: ParticipationMethod, _comittees: any[], formRef: React.RefObject<HTMLFormElement>): [
  ComitteeList] {
  const [comittees, setComittees] = React.useState(_comittees)

  React.useEffect(() => {
    setComittees(fetcher.data?.comittees ? fetcher.data?.comittees : _comittees)
  }, [fetcher.data, _comittees])

  React.useEffect(() => {
    fetcher.submit(formRef.current, { method: "GET" })
  }, [participationMethod])

  return [comittees]
}

export default route

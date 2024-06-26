import React from 'react'
import qs from "qs"
import { FetcherWithComponents, useFetcher } from '@remix-run/react';

import Dialog from '~/components/dialog'
import Spinner from '~/components/spinner';

const ParticipantsListPopover = (props: any) => {
  const fetcher = useFetcher<any>()
  useAddParticipant(fetcher, props.open, props.ids)

  return (
    <Dialog maxWidth>
      <div>
        {fetcher.state === "idle" ?
          fetcher.data?.users.length !== 0 ?
            <ol style={{ listStyle: "auto", marginLeft: "10px" }}>
              {fetcher.data?.users.map((item: any, i: number) => (
                <li key={i} className='text'>{item.name}</li>
              ))}
            </ol>
            :
            <div className='text italic'>
              Erro ao carregar os nomes
            </div>
          : <Spinner dim='18px' color='white'/>
        }
      </div>
    </Dialog>
  )
}

function useAddParticipant(fetcher: FetcherWithComponents<any>, open: boolean, ids: string) {
  React.useEffect(() => {
    if (open) {
      const searchParams = new URLSearchParams([["ids", qs.stringify(ids)]]);
      fetcher.load(`/api/participant/getParticipants?${searchParams}`)
    }
  }, [open])
}

export default ParticipantsListPopover

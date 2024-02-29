import React from 'react'
import { LoaderFunctionArgs, json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import { useUser } from '~/utils'
import { getDelegationId } from '~/session.server'

import Button from '~/components/button'
import Link from '~/components/link'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const delegationId = await getDelegationId(request)

  return json({ delegationId })
}

const Home = () => {
  const { delegationId } = useLoaderData<typeof loader>()
  const user = useUser()
  const paymentSucceed = user.stripePaidId
  const document = false

  const completed = () => {
    return (delegationId && paymentSucceed && document) ? true : false
  }

  return (
    <div className='section-wrapper padding'>
      <h2 className='section-title'>
        Inscrição

        <div className={`secondary-button-box ${completed() ? 'green-light' : 'red-light'}`}>
          <div>
            {completed() ? "Concluída" : "Incompleta"}
          </div>
        </div>
      </h2>

      <div className='home-container'>
        <Link to={delegationId ? '/dashboard/delegation' : "/join/delegation"}>
          <div className='home-item'>
            <div className='home-item-title'>
              Delegação
            </div>

            Entrar em uma delegação

            <Button className={`secondary-button-box ${delegationId ? 'green-light' : 'red-light'}`}>
              {delegationId ? 'Concluído' : 'Entrar'}
            </Button>
          </div>
        </Link>

        <Link to="/dashboard/payments">
          <div className='home-item'>
            <div className='home-item-title'>
              Pagamentos
            </div>

            Pagar taxa de Inscrição

            <Button className={`secondary-button-box ${paymentSucceed ? 'green-light' : 'red-light'}`}>
              {paymentSucceed ? 'Concluído' : 'Pendente'}
            </Button>
          </div>
        </Link>

        <Link to="/dashboard/documents">
          <div className='home-item'>
            <div className='home-item-title'>
              Documentos
            </div>

            Enviar documnentos

            <Button className={`secondary-button-box ${document ? 'green-light' : 'red-light'}`}>
              {document ? 'Concluído' : 'Pendente'}
            </Button>
          </div>
        </Link>
      </div>
    </div>
  )
}
export default Home

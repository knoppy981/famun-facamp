import React from 'react'
import { LoaderFunctionArgs, json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import { useUser } from '~/utils'
import { getDelegationId } from '~/session.server'

import Button from '~/components/button'
import Link from '~/components/link'
import { getDelegationById } from '~/models/delegation.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const delegationId = await getDelegationId(request)
  let delegation

  if (delegationId) {
    delegation = await getDelegationById(delegationId)
  }

  return json({
    delegationId,
    isDelegationComplete: delegation && delegation?.maxParticipants === delegation?._count.participants,
    isPaymentComplete: delegation && delegation?.participants.every(participant => participant.stripePaid),
    isDocumentComplete: delegation && delegation?.participants.reduce((accumulator, participant) => {
      if (participant.delegate) {
        if (participant.files.length >= 2) accumulator += 1
      } else if (participant.delegationAdvisor) {
        if (participant.files.length >= 1) accumulator += 1
      }
      return accumulator;
    }, 0) === delegation?.participants.length
  })
}

const Home = () => {
  const { delegationId, isDelegationComplete, isPaymentComplete, isDocumentComplete } = useLoaderData<typeof loader>()
  const completed = () => {
    return (isDelegationComplete && isPaymentComplete && isDocumentComplete) ? true : false
  }

  return (
    <div className='section-wrapper padding'>
      <h2 className='section-title'>
        Inscrição

        <div className={`secondary-button-box ${completed() ? 'green-light' : 'red-light'}`}>
          <div className='button-child'>
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

            {delegationId ? "Todos os delegados inscritos" : "Entrar em uma delegação"}

            <Button className={`secondary-button-box ${isDelegationComplete ? 'green-light' : 'red-light'}`}>
              {delegationId ? isDelegationComplete ? 'Concluído' : 'Pendente' : 'Entrar'}
            </Button>
          </div>
        </Link>

        <Link to="/dashboard/payments">
          <div className='home-item'>
            <div className='home-item-title'>
              Pagamentos
            </div>

            Pagar taxa de inscrição de toda delegação

            <Button className={`secondary-button-box ${isDelegationComplete && isPaymentComplete ? 'green-light' : 'red-light'}`}>
              {delegationId ? isPaymentComplete ? 'Concluído' : 'Pendente' : 'Primeiro entre em uma delegação'}
            </Button>
          </div>
        </Link>

        <Link to="/dashboard/documents">
          <div className='home-item'>
            <div className='home-item-title'>
              Documentos
            </div>

            Enviar documentos de toda delegação

            <Button className={`secondary-button-box ${isDelegationComplete && isDocumentComplete ? 'green-light' : 'red-light'}`}>
              {delegationId ? isDocumentComplete ? 'Concluído' : 'Pendente' : 'Primeiro entre em uma delegação'}
            </Button>
          </div>
        </Link>
      </div>
    </div>
  )
}
export default Home

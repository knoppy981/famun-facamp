import React from 'react'
import { Outlet, useRouteError } from '@remix-run/react'
import { LoaderFunctionArgs, json, redirect } from '@remix-run/node';

import { requireUserId } from '~/session.server';

import Link from '~/components/link'
import { FiArrowLeft } from "react-icons/fi/index.js";
import { getParticipantConfigurationRequirements } from '~/models/configuration.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  if (url.pathname === "/pay") return redirect("/pay/s")

  const config = await getParticipantConfigurationRequirements()

  if (!config?.allowParticipantsPayments ?? false) throw json({ message: "Pagamentos encerrados", name: "Pagamentos Encerrados" }, { status: 404 });

  const userId = await requireUserId(request)
  return json({ userId })
};

const Pay = () => {
  return (
    <div className='auth-wrapper'>
      <div className='return-link-wrapper'>
        <Link
          to={{
            pathname: '/dashboard/payments',
          }}
        >
          <FiArrowLeft /> Início
        </Link>
      </div>

      <Outlet />
    </div>
  )
}

export function ErrorBoundary() {
  const error = useRouteError() as any
  console.log(error)

  if (error?.data) {
    return (
      <div className='error-wrapper'>
        <div className='error-container'>
          <h2 className='error-title'>
            Erro :(
          </h2>

          <div className='error-message'>
            {error?.data?.message}
          </div>

          <div className='error-link-container'>
            <Link to='/'>Voltar para página inicial</Link>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className='error-wrapper'>
      <div className='error-container'>
        <h2 className='error-title'>
          Erro desconhecido
        </h2>

        <div className='error-message'>
          Oops, algo deu errado :(
        </div>

        <div className='error-link-container'>
          <Link to='/'>Voltar para página inicial</Link>
        </div>
      </div>
    </div>
  );
}

export default Pay

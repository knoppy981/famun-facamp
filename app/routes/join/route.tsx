import React from 'react'
import { Outlet, useRouteError, useSearchParams } from '@remix-run/react'
import Link from '~/components/link'
import { FiArrowLeft } from "react-icons/fi/index.js";
import { LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import { getUserId } from '~/session.server';
import { checkSubscriptionAvailability } from '~/models/configuration.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const isSubscriptionAvailable = await checkSubscriptionAvailability()

  if (!isSubscriptionAvailable) throw json({ message: "Inscrições fechadas", name: "Inscrições" }, { status: 404 });

  return json({})
}

const Join = () => {
  const [searchParams] = useSearchParams();

  return (
    <div className='auth-wrapper'>
      <div className='return-link-wrapper'>
        <Link
          to={{
            pathname: '/login',
            search: searchParams.toString()
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
    if (error?.data?.name === "Inscrições") {
      return (
        <div className='error-wrapper'>
          <div className='error-container'>
            <h2 className='error-title'>
              Inscrições fechadas
            </h2>

            <div className='error-message'>
              Entre em contato com a nossa Equipe para checar a disponibilidade de vagas
              <br />email: famun@facamp.com.br
            </div>

            <div className='error-link-container'>
              <Link to='/'>Voltar para página inicial</Link>
            </div>
          </div>
        </div>
      );
    } else {
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


export default Join

import React from 'react'
import { Outlet, useRouteError } from '@remix-run/react'
import { LoaderFunctionArgs, json, redirect } from '@remix-run/node';

import { getUserId } from '~/session.server';

import Link from '~/components/link'
import { FiArrowLeft } from "react-icons/fi/index.js";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request)

  const url = new URL(request.url);
  if (url.pathname === "/password") return redirect("/password/request")

  return userId ? redirect('/') : url.pathname === "/password" ? redirect("/password/request") : json({})
}

const Password = () => {
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

  if (error?.data) {
    if (error?.data?.name === "TokenExpiredError") {
      return (
        <div className='error-wrapper'>
          <div className='error-container'>
            <h2 className='error-title'>
              O Código expirou!
            </h2>

            <div className='error-message'>
              Volte para a página inicial e tente novamente!
              <br />Se o erro persistir entre em contato com a nossa equipe!
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

export default Password


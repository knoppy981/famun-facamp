import React from 'react'
import { Outlet, useLoaderData, useRouteError, useSearchParams } from '@remix-run/react'
import Link from '~/components/link'
import { FiArrowLeft } from "react-icons/fi/index.js";
import { LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import { checkSubscriptionAvailability } from '~/models/configuration.server';
import invariant from 'tiny-invariant';
import { decodeJwt } from '~/jwt';
import { checkJoinAuthenticationCode } from './utils/checkJoinAuthenticationCode';
import { getSession, getUserId, sessionStorage } from '~/session.server';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const session = await getSession(request)
  const isSubscriptionAvailable = await checkSubscriptionAvailability()
  const userId = await getUserId(request)

  if (token && typeof token === "string") {
    const decoded: any = await decodeJwt(token)

    if (decoded.err) throw json(
      { message: "Link inválido", name: "Erro no Link" },
      { status: 403 }
    );

    if (decoded.payload.code) {
      const check = await checkJoinAuthenticationCode(decoded.payload.code)

      if (!check) {
        throw json(
          { message: "Link inválido", name: "Erro no Link" },
          { status: 403 }
        )
      } else {
        session.set("join-authentication", token)

        return redirect(`/join/${userId ? "delegation" : "user"}`, {
          headers: {
            'Set-cookie': await sessionStorage.commitSession(session),
          },
        })
      }
    }
  } else if (session.get("join-authentication")) {
    const token = session.get("join-authentication")

    const decoded: any = await decodeJwt(token)

    if (decoded.err) {
      throw json(
        { message: "Link inválido", name: "Erro no Link" },
        { status: 403 }
      );
    } else {
      return json({ isSubscriptionAvailable: { subscriptionEM: true, subscriptionUNI: true, } })
    }
  }

  if (!isSubscriptionAvailable?.subscriptionEM && !isSubscriptionAvailable?.subscriptionUNI) {
    throw json(
      { message: "Inscrições fechadas", name: "Inscrições" },
      { status: 403 }
    )
  }

  return json({ isSubscriptionAvailable })
}

const Join = () => {
  const [searchParams] = useSearchParams();
  const { isSubscriptionAvailable } = useLoaderData<typeof loader>()

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

      <Outlet context={{ isSubscriptionAvailable }} />
    </div>
  )
}

export function ErrorBoundary() {
  const error = useRouteError() as any

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

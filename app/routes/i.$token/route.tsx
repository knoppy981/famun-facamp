import { useLoaderData, Form, useMatches, useSearchParams, useRouteError, useFetcher } from '@remix-run/react'
import invariant from 'tiny-invariant';
import { ActionFunctionArgs, LoaderFunctionArgs, json } from '@remix-run/node';

import { getDelegationByCode, joinDelegation } from '~/models/delegation.server'
import { requireUserId, createUserSession, getUser } from "~/session.server";
import { safeRedirect } from '~/utils';
import { decodeJwt } from '~/challenges.server';

import { FiArrowLeft } from "react-icons/fi/index.js";
import Button from '~/components/button';
import Link from '~/components/link';
import checkJoinDelegation from '~/utils/checkJoinDelegation';

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request)
  const formData = await request.formData()
  const delegationCode = formData.get("delegationCode") as string

  invariant(delegationCode, "Delegation Code is required")

  const delegation = await joinDelegation({ code: delegationCode, userId: userId })
    .catch((err) => {
      throw json(err, { status: 404 })
    })

  invariant(delegation, "Delegation not Found")

  return createUserSession({
    request,
    userId: userId,
    delegationId: delegation.id,
    redirectTo: "/",
  });
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const user = await getUser(request);
  const { token } = params
  invariant(token, "token is required")
  const decoded: any = await decodeJwt(token)

  if (decoded.err) throw json({ message: "Link inválido", name: "Erro no Link" }, { status: 404 });

  const { delegationCode } = decoded?.payload
  const delegation = await getDelegationByCode(delegationCode)

  try {
    await checkJoinDelegation(delegation?.id, user?.id)
  } catch (error: any) {
    throw json(
      error.message,
      { status: 404 }
    )
  }

  return json({ delegation, user })
}

/* export const handle = {
  i18n: "translation"
}; */

const invite = () => {

  /* const { t, i18n } = useTranslation("translation") */
  const [searchParams] = useSearchParams();
  const fetcher = useFetcher()
  const matches = useMatches()
  const { delegation, user } = useLoaderData<typeof loader>()

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

      <div className='auth-container'>
        <h1 className='auth-title'>
          FAMUN 2023
        </h1>

        <fetcher.Form method='post'>
          <h2 className='join-title'>
            Entrar na delegação!
          </h2>

          <h3 className='join-subtitle' style={{ margin: "10px 0" }}>
            Você foi convidado para participar da delegação do(a) {delegation?.school}
            {!user && <><br />Cadastre-se ou, se voce ja está cadastrado, entre na sua conta para participar.</>}
          </h3>

          <div className='join-buttons-container'>
            {user ?
              <Button className="primary-button-box">
                Entrar
              </Button>
              :
              <>
                <div className="primary-button-box">
                  <Link
                    to={{
                      pathname: `/join/user`,
                      search: `${new URLSearchParams([["redirectTo", safeRedirect(matches[1].pathname)]])}`
                    }}
                  >
                    Fazer cadastro
                  </Link>
                </div>

                <div className="primary-button-box">
                  <Link
                    to={{
                      pathname: `/login`,
                      search: `${new URLSearchParams([["redirectTo", safeRedirect(matches[1].pathname)]])}`
                    }}
                  >
                    Fazer login
                  </Link>
                </div>
              </>
            }
          </div>

          <input type='hidden' name='delegationCode' value={delegation?.code} />
        </fetcher.Form>
      </div>
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
            {error?.data}
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

export default invite
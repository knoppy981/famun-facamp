import React from 'react';
import { LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import { useLoaderData, Outlet, NavLink, useRouteError, useMatches, useOutletContext } from '@remix-run/react';
import { motion } from 'framer-motion';

import { getDelegationId } from '~/session.server';
import { getDelegationById } from '~/models/delegation.server';

import { FiMail } from 'react-icons/fi/index.js';
import { useStickyContainer } from '~/hooks/useStickyContainer';
import PopoverTrigger from '~/components/popover/trigger';
import Dialog from '~/components/dialog';
import Button from '~/components/button';
import Link from '~/components/link';
import { useCopyToClipboard } from './hooks/useCopyToClipboard';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  if (url.pathname === "/dashboard/delegation") return redirect("/dashboard/delegation/participants")

  const delegationId = await getDelegationId(request)

  if (!delegationId) throw json({ message: "Você precisa estar em uma delegação para acessar está página", name: "Erro no Usuário" }, { status: 404 });

  const delegation = await getDelegationById(delegationId)

  return json({ delegation });
}

const Delegation = () => {
  const { delegation } = useLoaderData<typeof loader>()
  const [stickyRef, isSticky] = useStickyContainer()
  const [isCopied, handleCopyClick] = useCopyToClipboard(delegation?.inviteLink)
  const matches = useMatches()
  const { config } = useOutletContext<{
    config: {
      allowParticipantsChangeData: boolean | null;
      allowParticipantsPayments: boolean | null;
      allowParticipantsSendDocuments: boolean | null;
    }
  }>()
  const allowParticipantsChangeData = config?.allowParticipantsChangeData ?? false

  return (
    <div className='section-wrapper'>
      <motion.div className='delegation-nav'>
        <div className='delegation-title-container'>
          <h3 className='delegation-subtitle'>
            Delegação
          </h3>

          <h2 className='delegation-title'>
            {delegation?.school}
          </h2>
        </div>

        <div className='delegation-popover-container'>
          <PopoverTrigger label={<><FiMail className='icon' /> Convidar</>}>
            <Dialog maxWidth>
              <div className='dialog-title'>
                Compartilhe o link abaixo
              </div>

              <div className='dialog-container'>
                <input className='dialog-read-only-input' readOnly value={delegation?.inviteLink} />
              </div>

              <Button onPress={handleCopyClick} className={`secondary-button-box ${isCopied ? "green-dark" : "blue-dark"}`}>
                {isCopied ? 'Copiado!' : 'Copiar'}
              </Button>

              <div className='dialog-title'>
                Ou utilize o código abaixo na inscrição
              </div>

              <div className='dialog-item'>
                {delegation?.code}
              </div>
            </Dialog>
          </PopoverTrigger>
        </div>
      </motion.div>

      <div className={`section-menu ${isSticky ? "sticky" : ""}`} ref={stickyRef}>
        {[
          { to: "participants", title: "Participantes", active: "/dashboard/delegation/participants" },
          { to: "createUser", title: "Adicionar Participante", active: "/dashboard/delegation/createUser" },
          { to: "data", title: "Dados", active: "/dashboard/delegation/data" }
        ].map((item, index) => {
          const ref = React.useRef<HTMLAnchorElement>(null)

          React.useEffect(() => {
            if (matches?.[3]?.pathname === item.active) ref.current?.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'center'
            })
          }, [matches])

          return (
            <NavLink
              key={index}
              className="section-menu-item"
              tabIndex={0}
              role="link"
              prefetch='render'
              aria-label={`${item.title}-page`}
              to={item.to}
              ref={ref}
            >
              {({ isActive }) => (
                <>
                  {item.title}
                  {isActive ? <motion.div className='section-underline' layoutId="delegationPageUnderline" /> : null}
                </>
              )}
            </NavLink>
          )
        })}
      </div>

      <Outlet context={{ delegation, config }} />
    </div>
  )
}

export function ErrorBoundary() {
  const error = useRouteError() as any
  console.log(error)

  if (error?.data?.name) {
    return (
      <div className='error-small-container'>
        {/* <h2 className='error-subtitle'>
          Erro :(
        </h2> */}

        <div className='error-message'>
          {error?.data?.message}
        </div>

        <div className='error-link-container'>
          <Link to='/join/delegation'>Entrar em uma delegação</Link>
        </div>
      </div>
    );
  }
  return (
    <div className='error-small-container'>
      <h2 className='error-subtitle'>
        Erro desconhecido
      </h2>

      <div className='error-message'>
        Oops, algo deu errado :(
      </div>

      <div className='error-link-container'>
        <Link to='/'>Voltar para página inicial</Link>
      </div>
    </div>
  );
}

export default Delegation
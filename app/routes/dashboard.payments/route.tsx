import React from 'react'
import Stripe from 'stripe'
import { LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import { useLoaderData, NavLink, Outlet, useRouteError, Link } from '@remix-run/react'
import { AnimatePresence, motion } from 'framer-motion'

import { useStickyContainer } from '~/hooks/useStickyContainer'
import { getDelegationId, requireUser } from '~/session.server'
import { getRequiredPayments } from '~/models/payments.server'
import { getChargesByCustomerId, getPaymentIntentById, getPaymentsIntentByCustomerId } from '~/stripe.server'
import { ensureStripeCostumer } from '~/models/user.server';
import { useModalContext } from './useModalContext'
import Modal from '~/components/modalOverlay'
import Dialog from '~/components/dialog'
import Button from '~/components/button'

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  if (url.pathname === "/dashboard/payments") return redirect("/dashboard/payments/pending")

  const user = await requireUser(request)
  await ensureStripeCostumer(user)

  const delegationId = await getDelegationId(request)
  if (!delegationId) throw json({ message: "Você precisa estar em uma delegação para acessar os pagamentos", name: "Erro no usuário" }, { status: 404 });

  const requiredPayments = await getRequiredPayments({ userId: user.id, isLeader: user.leader, delegationId })

  const paymentsList: {
    amount: number,
    currency: string,
    status: Stripe.Charge.Status,
    metadata: Stripe.Metadata,
    created: number,
    receiptUrl: string | null,
    paymentMethod: string | undefined
  }[] = []

  try {
    const charges = await getChargesByCustomerId(user.stripeCustomerId)
    charges.data.forEach((ch: Stripe.Charge, index) => {
      paymentsList.push({
        amount: ch.amount,
        currency: ch.currency,
        status: ch.status,
        metadata: ch.metadata,
        created: ch.created,
        receiptUrl: ch.receipt_url,
        paymentMethod: ch.payment_method_details?.type
      })
    })
  } catch (error) {
    console.log(error)
  }

  const redirectStatus = url.searchParams.get("redirect_status");
  const paymentIntentId = url.searchParams.get("payment_intent")
  let recentPayment
  if (redirectStatus === "succeeded" && paymentIntentId) {
    recentPayment = await getPaymentIntentById(paymentIntentId)
  }

  return json({ requiredPayments, paymentsList, recentPayment })
}

const Payments = () => {
  const { requiredPayments, paymentsList, recentPayment } = useLoaderData<typeof loader>()
  const [stickyRef, isSticky] = useStickyContainer()
  const [modalContext, state] = useModalContext(recentPayment as any)

  return (
    <div className='section-wrapper'>
      <h2 className='section-title padding'>
        Pagamentos
      </h2>

      <AnimatePresence>
        {state.isOpen ?
          <Modal state={state} isDismissable>
            <Dialog maxWidth>
              <div className="dialog-subitem">
                Seu pagamento será processado e poder levar até 5 minutos para que ele seja contabilizado em nosso sistema.
              </div>

              <div className="dialog-subitem">
                Em breve você receberá o recibo da transação por e-mail.
              </div>

              <div className="dialog-subitem" style={{ marginBottom: "10px" }}>
                Caso seu pagamento não apareça como efetuado ou não seja enviado o recibo por e-mail, entre em contato com famun@facamp.com.br
              </div>

              <Button className="secondary-button-box blue-dark" onPress={state.close}>
                Fechar
              </Button>
            </Dialog>
          </Modal>
          :
          null
        }
      </AnimatePresence>

      <div className={`section-menu ${isSticky ? "sticky" : ""}`} ref={stickyRef}>
        {[
          { to: "pending", title: "Pendentes" },
          { to: "completed", title: "Realizados" },
        ].map((item, index) => (
          <NavLink
            key={index}
            className="section-menu-item"
            tabIndex={0}
            role="link"
            prefetch='render'
            aria-label={`payment-${item.title}-page`}
            to={item.to}
          >
            {({ isActive }) => (
              <>
                {item.title}
                {isActive ? <motion.div className='section-underline' layoutId="paymentsPageUnderline" /> : null}
              </>
            )}
          </NavLink>

        ))}
      </div>

      <Outlet context={{ requiredPayments, paymentsList }} />
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

export default Payments
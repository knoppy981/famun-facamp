import { useState, useRef, useEffect } from 'react'
import { json, redirect } from '@remix-run/node'
import { useLoaderData, useCatch, useMatches, NavLink, Outlet } from '@remix-run/react'

import { getDelegationId, requireUser } from '~/session.server'
import { getRequiredPayments } from '~/models/payments.server'
import { getUserPayments } from '~/stripe.server'
import { safeRedirect } from '~/utils'

import { ensureStripeCostumer } from '~/models/user.server';

import * as S from '~/styled-components/dashboard/payment'
import * as E from '~/styled-components/error'
import { useIsContainerSticky } from '~/hooks/useIsContainerSticky'

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  if (url.pathname === "/dashboard/payment") return redirect("/dashboard/payment/pending")

  const user = await requireUser(request)
  await ensureStripeCostumer(user)

  const delegationId = await getDelegationId(request)
  if (!delegationId) throw json({ errors: { delegation: "No delegation found" } }, { status: 404 });

  const payments = await getRequiredPayments({ user, delegationId })

  const paymentsIntents = await getUserPayments(user.id)
  paymentsIntents.forEach((el, index) => {
    const { amount, status, metadata, created, charges } = el
    const { payment_method_details, receipt_url } = charges.data[0]
    paymentsIntents[index] = { amount, status, metadata, created, receipt_url, type: payment_method_details.type }
  })

  return json({ payments, userPaymentsIntents: paymentsIntents })
}

const payment = () => {

  const { payments, userPaymentsIntents } = useLoaderData()
  const [stickyRef, isSticky] = useIsContainerSticky()

  return (
    <S.Wrapper>
      <S.Title>
        Pagamentos
      </S.Title>

      <S.Menu ref={stickyRef} isSticky={isSticky}>
        {[
          { to: "pending", title: "Pendentes" },
          { to: "completed", title: "Realizados" },
        ].map((item, i) => (
          <S.MenuItem key={i}>
            <NavLink
              tabIndex="0"
              role="link"
              prefetch='render'
              aria-label={`payment-${item.title}-page`}
              to={item.to}
            >
              {({ isActive }) => (
                <> {item.title} {isActive ? <S.UnderLine layoutId="paymentPageUnderline" /> : null} </>
              )}
            </NavLink>
          </S.MenuItem>
        ))}
      </S.Menu>

      <S.OverflowContainer>
        <Outlet context={{ payments, userPaymentsIntents }} />
      </S.OverflowContainer>
    </S.Wrapper >
  )
}

export function CatchBoundary() {
  const caught = useCatch();
  const matches = useMatches()

  if (caught.data.errors.delegation === "No delegation found") {
    return (
      <S.Wrapper>
        <S.Title>
          Delegação
        </S.Title>

        <E.Message>
          Para realizar os pagamentos é necessário entrar em uma delegação

          <E.GoBacklink to={`/join/delegation?${new URLSearchParams([["redirectTo", safeRedirect(matches[1].pathname)]])}`}>
            Entrar em uma delegação
          </E.GoBacklink>
        </E.Message>

      </S.Wrapper>
    );
  }

  throw new Error(`Unsupported thrown response status code: ${caught.status}`);
}

export function ErrorBoundary({ error }) {
  if (error instanceof Error) {
    return (
      <S.Wrapper>
        <S.Title>
          Unknown error
        </S.Title>

        <E.Message>
          {error.message} <E.GoBacklink to='/'>Voltar para página inicial</E.GoBacklink>
        </E.Message>
      </S.Wrapper>
    );
  }
  return <E.Message>Oops, algo deu errado!</E.Message>;
}


export default payment
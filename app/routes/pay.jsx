import { useEffect, useState } from 'react'
import { json } from '@remix-run/node'
import { Link, useLoaderData, useActionData, useSearchParams, Outlet } from '@remix-run/react'
import qs from "qs"

import { createPaymentIntent } from '~/stripe.server'
import { requireUser, requireDelegationId } from '~/session.server'
import { ensureStripeCostumer } from '~/models/user.server'
import { getRequiredPayments } from '~/models/payments.server'
import { useUser } from '~/utils'

import * as S from "~/styled-components/pay"
import LanguageMenu from '~/styled-components/components/dropdown/languageMenu'
import { FiAlertTriangle, FiArrowLeft, FiHelpCircle, FiSettings } from 'react-icons/fi'
/* import { useTranslation } from 'react-i18next' */

export const loader = async ({ request }) => {
  const user = await requireUser(request)
  await ensureStripeCostumer(user)

  const delegationId = await requireDelegationId(request)

  const payments = await getRequiredPayments({ user, delegationId })

  return json({ payments, WEBSITE_URL: process.env.WEBSITE_URL })
}

/* export const handle = {
  i18n: "translation"
}; */

const Pay = () => {

  /* const { t, i18n } = useTranslation("translation") */

  const { payments, WEBSITE_URL } = useLoaderData()
  const actionData = useActionData()
  const user = useUser()

  const [searchParams] = useSearchParams();

  //const selectedPayment = payments.filter(payment => searchParams.getAll("s").includes(payment.name));

  const [selectedPaymentsNames, setSelectedPaymentsNames] = useState(searchParams.getAll("s"))
  const [price, setPrice] = useState(0)

  useEffect(() => {
    const sumPrices = payments.reduce((sum, payment) => {
      if (selectedPaymentsNames.includes(payment.name)) {
        return sum + payment.price;
      }
      return sum;
    }, 0);

    setPrice(sumPrices)
  }, [selectedPaymentsNames])

  return (
    <S.Wrapper>
      <S.ExternalButtonWrapper>
        <S.ExternalButton to={{
          pathname: '/dashboard/payment',
        }}>
          <FiArrowLeft /> Início
        </S.ExternalButton>
      </S.ExternalButtonWrapper>

      <LanguageMenu /* i18n={i18n} */ />

      <Outlet context={{
        payments,
        selectedPaymentsNames,
        setSelectedPaymentsNames,
        price,
        err: actionData?.errors,
        user,
        WEBSITE_URL
      }} />
    </S.Wrapper>
  )
}

export default Pay
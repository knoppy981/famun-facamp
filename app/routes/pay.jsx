import { useEffect, useState } from 'react'
import { json } from '@remix-run/node'
import { Link, useLoaderData, useActionData, useSearchParams } from '@remix-run/react'
import qs from "qs"

import { createPaymentIntent } from '~/stripe.server'
import { requireUser, requireDelegationId } from '~/session.server'
import { ensureStripeCostumer } from '~/models/user.server'
import { getRequiredPayments } from '~/models/payments.server'
import { useUser } from '~/utils'

import * as S from "~/styled-components/pay"
import CompletePayment from '~/styled-components/pay/completePayment'
import SelectPayment from '~/styled-components/pay/selectPayments'
import LanguageMenu from '~/styled-components/components/dropdown/languageMenu'
import { FiAlertTriangle, FiArrowLeft, FiHelpCircle, FiSettings } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'

export const action = async ({ request }) => {
  const text = await request.text()
  const { stripeCustomerId, userId, step, action, ...data } = qs.parse(text)

  let paidUsersIds = []
  let delegationId
  let price = 0
  const nextStep = Number(step) + (action === 'next' ? 1 : -1)

  if (action === 'next') {
    if (!data.payments)
      return json({ errors: { selectedPayments: "Select at least one payment" } }, { status: 400 });

    if (data.payments) {
      if (data.payments.length > 20) {
        const parsed = qs.parse(data.payments)
        parsed.type === 'user' ? paidUsersIds.push(parsed.id) : delegationId = parsed.id
        price += Number(parsed.price)
      } else {
        data.payments.forEach(item => {
          const parsed = qs.parse(item)
          parsed.type === 'user' ? paidUsersIds.push(parsed.id) : delegationId = parsed.id
          price += Number(parsed.price)
        });
      }
    }

    const paymentIntent = await createPaymentIntent({ price, userId, stripeCustomerId, delegationId, paidUsersIds })

    return json({ step: nextStep, paymentIntent })
  }

  return json({ step: nextStep })
}

export const loader = async ({ request }) => {
  const user = await requireUser(request)
  await ensureStripeCostumer(user)

  const delegationId = await requireDelegationId(request)

  const payments = await getRequiredPayments({ user, delegationId })

  return json({ payments, WEBSITE_URL: process.env.WEBSITE_URL })
}

export const handle = {
  i18n: "translation"
};

const Pay = () => {

  const { t, i18n } = useTranslation("translation")

  const { payments, WEBSITE_URL } = useLoaderData()
  const actionData = useActionData()
  const user = useUser()

  const [searchParams] = useSearchParams();
	const selectedPayment = payments.find(el => el.name === searchParams.get("s"));

  let step = actionData?.step
  if (!step) step = 1

  const [selectedPayments, setSelectedPayments] = useState([selectedPayment])
  const [price, setPrice] = useState(0)

  useEffect(() => {
    let _price = 0
    selectedPayments.forEach(el => _price += el.price)
    setPrice(_price)
  }, [selectedPayments])

  return (
    <S.Wrapper>
      <S.ExternalButtonWrapper>
        <S.ExternalButton to={{
          pathname: '/dashboard/payment',
        }}>
          <FiArrowLeft /> Início
        </S.ExternalButton>
      </S.ExternalButtonWrapper>

      <LanguageMenu i18n={i18n} />

      <S.Container>
        <S.TitleBox>
          <S.Title>
            FAMUN 2023
          </S.Title>

          <S.ArrowIconBox />

          <S.SubTitle>
            Pagamentos
          </S.SubTitle>
        </S.TitleBox>

        <S.StepsForm type="submit" noValidate method='post'>
          <input type="hidden" name="step" value={step} />
          <input type="hidden" name="stripeCustomerId" value={user.stripeCustomerId} />
          <input type="hidden" name="userId" value={user.id} />

          {step === 1 &&
            <SelectPayment
              payments={payments}
              selectedPayments={selectedPayments}
              setSelectedPayments={setSelectedPayments}
              price={price}
              setPrice={setPrice}
              err={actionData?.errors?.selectedPayments}
            />
          }

          {step === 2 &&
            <CompletePayment
              paymentIntent={actionData?.paymentIntent}
              payments={selectedPayments}
              price={price}
              WEBSITE_URL={WEBSITE_URL}
            />
          }

          <S.ControlButtonsContainer>
            {step != 1 && <S.ControlButton name="action" value="previous" type="submit" prev> Voltar </S.ControlButton>}
            {step != 2 && <S.ControlButton name="action" value="next" type="submit"> Próximo </S.ControlButton>}
          </S.ControlButtonsContainer>
        </S.StepsForm>
      </S.Container>
    </S.Wrapper>
  )
}

export default Pay
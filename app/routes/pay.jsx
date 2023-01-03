import { useEffect, useState } from 'react'
import { json } from '@remix-run/node'
import { Link, useLoaderData, useActionData } from '@remix-run/react'
import qs from "qs"

import { createPaymentIntent } from '~/stripe.server'
import { requireUser, requireDelegationId } from '~/session.server'
import { ensureStripeCostumer } from '~/models/user.server'
import { getRequiredPayments } from '~/models/payments.server'

import * as S from "~/styled-components/pay"
import CompletePayment from '~/styled-components/pay/completePayment'
import SelectPayment from '~/styled-components/pay/selectPayments'
import { FiAlertTriangle, FiArrowLeft, FiHelpCircle, FiSettings } from 'react-icons/fi'

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
  const payments = await getRequiredPayments({ userId: user.id, delegationId })

  return json({ payments, user })
}

const Pay = () => {

  const { payments, user } = useLoaderData()
  const actionData = useActionData()

  let step = actionData?.step
  if (!step) step = 1

  const [selectedPayments, setSelectedPayments] = useState([])
  const [price, setPrice] = useState(0)

  useEffect(() => {
    console.log(actionData)
  }, [actionData])

  return (
    <S.Wrapper>

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

        <S.Navbar>
          <S.NavMenu>
            <Link to="/dashboard/payment">
              <S.NavItem>
                <S.NavIcon>
                  <FiArrowLeft />
                </S.NavIcon>
                Dashboard
              </S.NavItem>
            </Link>
          </S.NavMenu>

          <S.NavMenu>
            <S.NavItem>
              <S.NavIcon>
                <FiHelpCircle />
              </S.NavIcon>
              Ajuda
            </S.NavItem>

            <S.NavItem>
              <S.NavIcon>
                <FiSettings />
              </S.NavIcon>
            </S.NavItem>
          </S.NavMenu>
        </S.Navbar>

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
            />
          }

          {step === 2 &&
            <CompletePayment
              paymentIntent={actionData?.paymentIntent}
              payments={selectedPayments}
              price={price}
            />
          }

          <S.ControlButtonsContainer>
            {step != 1 && <S.ControlButton name="action" value="previous" type="submit" prev> Voltar </S.ControlButton>}
            {step != 2 && <S.ControlButton name="action" value="next" type="submit"> Próximo </S.ControlButton>}
            {actionData?.errors?.selectedPayments && <S.Error> <FiAlertTriangle /> {actionData.errors.selectedPayments}</S.Error>}
          </S.ControlButtonsContainer>
        </S.StepsForm>
      </S.Container>
    </S.Wrapper>
  )
}

export default Pay
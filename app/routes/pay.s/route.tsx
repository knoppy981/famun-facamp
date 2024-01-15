import React from 'react'
import { Form, useActionData, useLoaderData, useNavigation } from '@remix-run/react'
import { LoaderFunctionArgs, json } from '@remix-run/node'

import { requireUser, requireDelegationId } from '~/session.server'
import { ensureStripeCostumer } from '~/models/user.server'
import { getRequiredPayments } from '~/models/payments.server'

import Spinner from '~/components/spinner'
import Button from '~/components/button';
import { CheckboxGroup, Checkbox } from '~/components/checkbox/checkbox-group'
import { FiAlertCircle } from 'react-icons/fi/index.js'
import { handlePaymentsSelection } from './handlePaymentsSelection'
import PopoverTrigger from '~/components/popover/trigger'
import Dialog from '~/components/dialog'
import { getCurrentLocale } from '~/hooks/useCurrentLocale'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireUser(request)
  await ensureStripeCostumer(user)

  const delegationId = await requireDelegationId(request)

  const payments = await getRequiredPayments({ userId: user.id, isLeader: user.leader, delegationId })

  return json({ payments })
}

const SelectPayments = () => {
  const { payments } = useLoaderData<typeof loader>()
  const actionData = useActionData<any>()
  const err = actionData?.errors
  const transition = useNavigation()
  const locale = getCurrentLocale()
  const [selectedPaymentsNames, setSelectedPaymentsNames, price, isButtonDisabled] = handlePaymentsSelection(payments)

  return (
    <Form action="/pay/c" method="get" className='auth-container'>
      <h1 className='auth-title'>
        FAMUN 2024
      </h1>

      <h2 className='join-title'>
        Selecione os pagamentos a serem realizados
      </h2>

      <div className='pay-list'>
        <CheckboxGroup
          className='pay-item-container'
          name="s"
          aria-label="Pagamento Selecionados"
          value={selectedPaymentsNames}
          onChange={setSelectedPaymentsNames}
          errorMessage={err}
          action={actionData}
        >
          {payments?.map((item, index: number) => {
            console.log(item.available)
            console.log(item.expired)
            const isDisabled = !item.available || item.expired
            return (
              <div className='pay-item' key={index}>
                <Checkbox
                  value={item.name}
                  isDisabled={isDisabled}
                >
                  <span className='pay-item-overflow-text' style={{ opacity: isDisabled ? .2 : 1 }}>
                    Inscrição de {item.name}
                  </span>

                  <div className='pay-item-right-container' style={{ opacity: isDisabled ? .2 : 1 }}>
                    <div className={`secondary-button-box ${item.available ? 'green-light' : 'red-light'}`} >
                      <div>
                        {(item.price / 100).toLocaleString(locale, { style: "currency", currency: item.currency })}
                      </div>
                    </div>
                  </div>
                </Checkbox>

                {isDisabled ?
                  <PopoverTrigger label={<FiAlertCircle className='icon error' />}>
                    <Dialog maxWidth>
                      {item.expired ?
                        <div className='dialog-title'>
                          O prazo para realizar o pagamento do(a) {item.name} se encerrou, entre em contato com a nossa equipe para ajustá-lo
                        </div>
                        :
                        <div className='dialog-title'>
                          Somente líderes e orientadores podem realizar pagamentos de outros participantes
                        </div>
                      }
                    </Dialog>
                  </PopoverTrigger>
                  :
                  null
                }
              </div>
            )
          })}
        </CheckboxGroup>
      </div>

      <div className='pay-price'>
        {(price / 100).toLocaleString(locale, { style: "currency", currency: "BRL" })}
      </div>

      <Button
        className={`primary-button-box ${isButtonDisabled ? "transparent" : ""}`}
        type='submit'
        isDisabled={isButtonDisabled}
      >
        Próximo
        {transition.state !== "idle" && transition.formAction === "/pay/c" && <Spinner dim="18px" />}
      </Button>
    </Form>
  )
}

export default SelectPayments
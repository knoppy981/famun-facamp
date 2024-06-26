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
import { handlePaymentsSelection } from './utils/handlePaymentsSelection'
import PopoverTrigger from '~/components/popover/trigger'
import Dialog from '~/components/dialog'
import { getCurrentLocale } from '~/hooks/useCurrentLocale'
import TextField from '~/components/textfield'

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
  const [selectedPaymentsNames, handlePaymentSelection, price, currency, isButtonDisabled] = handlePaymentsSelection(payments)

  return (
    <Form action="/pay/c" method="get" className='pay-container'>
      <h1 className='auth-title'>
        FAMUN {new Date().getFullYear()}
      </h1>

      <div className='pay-grid'>
        <div className='pay-grid-container'>
          <h2 className='join-title' style={{ margin: 0 }}>
            Selecione os pagamentos a serem realizados
          </h2>

          <div className='pay-list'>
            <CheckboxGroup
              className='pay-item-container'
              name="s"
              aria-label="Pagamento Selecionados"
              value={selectedPaymentsNames?.map(selectedPayment => selectedPayment.name)}
              errorMessage={err}
              action={actionData}
            >
              {payments?.map((item, index: number) => {
                const isDisabled = !item.available || item.expired || (currency !== "" && item.currency !== currency)
                return (
                  <div className='pay-item' key={index}>
                    <Checkbox
                      value={item.name}
                      isDisabled={isDisabled}
                      onChange={e => handlePaymentSelection(e, item.name, item.currency)}
                    >
                      <span className='pay-item-overflow-text' style={{ opacity: isDisabled ? .2 : 1 }}>
                        Inscrição de {item.name}
                      </span>

                      <div className='pay-item-right-container' style={{ opacity: isDisabled ? .2 : 1 }}>
                        <div className={`secondary-button-box ${item.available ? 'green-light' : 'red-light'}`} >
                          <div className='button-child'>
                            {(item.price / 100).toLocaleString(locale, { style: "currency", currency: item.currency })}
                          </div>
                        </div>
                      </div>
                    </Checkbox>

                    {isDisabled ?
                      <PopoverTrigger label={<FiAlertCircle className='icon error' />}>
                        <Dialog maxWidth>
                          {item.expired ?
                            <div className='text'>
                              O prazo para realizar o pagamento do(a) {item.name} se encerrou, entre em contato com a nossa equipe para ajustá-lo
                            </div>
                            : !item.available ?
                              <div className='text'>
                                Somente líderes e orientadores podem realizar pagamentos de outros participantes
                              </div>
                              :
                              <div className='text'>
                                Não é possível realizar pagamentos em moedas diferentes juntos
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
        </div>

        <div className='pay-grid-container'>
          <div className='pay-price'>
            {(price / 100).toLocaleString(locale, { style: "currency", currency: currency ? currency : "brl" })}
          </div>

          <TextField
            name='coupon'
            className='primary-input-box'
            label="Código Promocional"
          />

          <Button
            className={`primary-button-box ${isButtonDisabled ? "transparent" : ""}`}
            type='submit'
            isDisabled={isButtonDisabled}
          >
            Próximo
            {transition.state !== "idle" && transition.formAction === "/pay/c" && <Spinner dim="18px" />}
          </Button>
        </div>
      </div>
    </Form>
  )
}

export default SelectPayments
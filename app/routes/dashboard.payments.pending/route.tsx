import React from 'react'
import { useNavigate, useOutletContext } from '@remix-run/react'

import { OutletType } from '../dashboard.payments/types'
import { getCurrentLocale } from '~/hooks/useCurrentLocale'

import { FiAlertCircle, FiExternalLink } from 'react-icons/fi/index.js'
import PopoverTrigger from '~/components/popover/trigger'
import Dialog from '~/components/dialog'

const PendingPayments = () => {
  const { requiredPayments }: OutletType = useOutletContext()
  const navigate = useNavigate()
  const handlePaymentClick = (username: string) => {
    navigate(`/pay/s?${new URLSearchParams([["s", username]])}`)
  }
  const locale = getCurrentLocale()

  return (
    <>
      <i className='payments-warning'>
        Observações:
        <br />
        Todos os pagamentos devem feitos em até 5 dias úteis após a submissão da inscrição. Cada participante pode realizar seu pagamento individualmente, ou ainda, um único participante pode fazer o pagamento para todos da delegação.
        <br />
        Caso os pagamentos não sejam realizados nesse período, a inscrição poderá será cancelada e a delegação deverá realizar uma nova inscrição caso deseje participar da conferência. A nova inscrição dependerá da disponibilidade de vagas.
        <br />
        ATENÇÃO:  O FAMUN 2024 não realiza reembolso ou ressarcimento das taxas de inscrição, sob nenhuma circunstância.
      </i>

      {requiredPayments?.find(el => el.available) ?
        <div className='overflow-container'>
          <table className='table'>
            <thead>
              <tr className="table-row example">
                <td className='table-cell'>
                  Pagamento
                </td>

                <td className='table-cell' style={{ paddingLeft: "30px" }}>
                  Preço
                </td>

                <td className='table-cell'>
                  Expira em
                </td>
              </tr>
            </thead>

            <tbody>
              {requiredPayments.map((item, index) => {
                if (!item.available) return null
                const expiresAt = new Date(item.expiresAt as any)
                return (
                  <tr
                    className={`table-row ${!item.expired ? "cursor" : ""}`}
                    key={index}
                    onClick={() => !item.expired ? handlePaymentClick(item.name) : null}
                    tabIndex={0}
                    role="link"
                    aria-label={`Pay for user ${item.name}`}
                    onKeyDown={(event) => {
                      if (item.expired) return
                      if (event.key === 'Enter' || event.key === 'Space') {
                        handlePaymentClick(item.name);
                        event.preventDefault();
                      }
                    }}
                  >
                    <td className='table-cell'>
                      <div className='table-flex-cell' style={{ opacity: item.expired ? .2 : 1 }}>

                        Inscrição de {item.name}

                        <div className="secondary-button-box blue-light">
                          <div className='button-child'>
                            <FiExternalLink className='icon' /> Pagar
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className='table-cell'>
                      <div className='table-flex-cell'>
                        <div className="secondary-button-box red-light" style={{ opacity: item.expired ? .2 : 1 }}>
                          <div className='button-child'>
                            {(item.price / 100).toLocaleString(locale, { style: "currency", currency: item.currency })}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className='table-cell'>
                      <div className={`table-flex-cell ${item.expired ? "error" : ""}`}>
                        {expiresAt.toLocaleString('pt-BR', {
                          timeZone: 'America/Sao_Paulo',
                          year: 'numeric',
                          month: 'numeric',
                          day: 'numeric'
                        })}

                        {item.expired ?
                          <PopoverTrigger label={<FiAlertCircle className='icon error' />}>
                            <Dialog maxWidth>
                              <div className='dialog-title'>
                                O prazo para realizar o pagamento se encerrou, entre em contato com a nossa equipe para ajustá-lo
                              </div>
                            </Dialog>
                          </PopoverTrigger>
                          :
                          null
                        }
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        :
        <h2 className="payments-warning text w500">
          Voce ja realizou todos os pagamentos necessários
        </h2>
      }
    </>
  )
}

export default PendingPayments

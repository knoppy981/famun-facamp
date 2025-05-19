import React from 'react'
import { useNavigate, useOutletContext } from '@remix-run/react'

import { OutletType } from '../dashboard.payments/utils/types'
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
        <b>1. Garantia das vagas</b>
        <br />
        Para garantir suas vagas no FAMUN 2025, a delegação deve realizar o pagamento de TODOS(AS) OS(AS) PARTICIPANTES (delegados(as) e Professores(as) Orientadores(as)) em até 7 dias corridos, a contar da data da inscrição. 
        <br />
        Caso os pagamentos não sejam realizados nesse período, a inscrição será cancelada e a delegação deverá realizar uma nova inscrição, caso deseje participar da conferência. A nova inscrição dependerá da disponibilidade de vagas.
        <br />
        <br />
        <b>2. Formas de pagamento</b>
        <br />
        Os pagamentos podem ser feitos individualmente por cada participante; ou os Professores Orientadores e Head Delegates podem pagar a inscrição de todos(as) os(as) delegados(as). A delegação pode escolher a forma que melhor lhe convier.
        <br />
        <br />

        <b>Pagamento via cartão de crédito ou boleto:</b> clique em “Pagar” abaixo. O próprio sistema gerará o recibo e você receberá um e-mail.
        <br />
        <br />

        <b>Pagamento via PIX:</b> pague o valor correspondente à sua taxa de inscrição usando a Chave PIX: famun@facamp.com.br. Após terminar a transição, anexe o comprovante do PIX na aba “Documentos”. Salve o comprovante com o nome da delegação correspondente ao pagamento.
        <br />
        <br />

        <b>ATENÇÃO: o FAMUN {new Date().getFullYear()} não realiza reembolso ou ressarcimento das taxas de inscrição, sob nenhuma circunstância.</b>
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

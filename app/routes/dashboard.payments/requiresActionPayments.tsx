import React from 'react'
import { HTMLLink } from '~/components/link';
import { FiAlertCircle, FiExternalLink } from 'react-icons/fi/index.js'
import { getCurrentLocale } from '~/hooks/useCurrentLocale';

export type RequiresActionPaymentsType = {
  id: string,
  amount: number;
  currency: string;
  status: string;
  metadata: any;
  created: number;
  expiresAt: number | undefined | null;
  payUrl: string | undefined | null;
  pdfUrl: string | undefined | null;
  isVisible: boolean;
}[];

const RequiresActionPayments = ({ requiresActionPayments }: { requiresActionPayments: RequiresActionPaymentsType }) => {
  if (requiresActionPayments.length === 0) return
  const locale = getCurrentLocale()

  return (
    <>
      <div className='text label'>
        Você tem
        {requiresActionPayments.length === 1 ?
          " 1 pagamento que precisa de ações necessárias para ser concluído"
          : " " + requiresActionPayments.length + " pagamentos que precisam de ações necessárias para serem concluídos"
        }
      </div>

      <div className='overflow-container'>
        <table className='table'>
          <tbody>
            {requiresActionPayments.map((item, index) => {
              if (!item.isVisible) return
              return (
                <tr
                  className="table-row"
                  key={index}
                  aria-label={`Payment realized by user ${""}`}
                >
                  <td className='table-cell'>
                    <div className='table-flex-cell'>
                      Boleto

                      <div className="secondary-button-box green-light">
                        <div className='button-child'>
                          {(item.amount / 100).toLocaleString(locale, { style: "currency", currency: item.currency })}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className='table-cell'>
                    <div className='table-flex-cell'>
                      <HTMLLink href={item.payUrl as string | undefined} target="_blank" rel="noopener noreferrer">
                        <div className="secondary-button-box blue-light">
                          <div className='button-child'>
                            <FiExternalLink className='icon' /> Pagar
                          </div>
                        </div>
                      </HTMLLink>
                    </div>
                  </td>

                  <td className='table-cell'>
                    <div className='table-flex-cell'>
                      <HTMLLink href={item.pdfUrl as string | undefined} target="_blank" rel="noopener noreferrer">
                        <div className="secondary-button-box blue-light">
                          <div className='button-child'>
                            <FiExternalLink className='icon' /> PDF
                          </div>
                        </div>
                      </HTMLLink>
                    </div>
                  </td>

                  <td className='table-cell'>
                    Expira em: {item.expiresAt ? new Date(item.expiresAt * 1000).toLocaleString('pt-BR', {
                      timeZone: 'America/Sao_Paulo',
                      year: 'numeric',
                      month: 'numeric',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    }) : null}
                  </td>
                </tr>
              )
            }
            )}
          </tbody>
        </table>

        {requiresActionPayments.some((requiresActionPayment) => !requiresActionPayment.isVisible) ?
          <div className='text label error'>
            O sistema detectou que havia um boleto a ser pago pela sua delegação com o preço incluído com o de uma inscrição de um participante que já foi paga, por favor, não utilize mais este boleto. <br />
            Você não poderá acessar mais este boleto através do nosso sitema, porém ainda é possível pagá-lo por meios externos, então pedimos que você não conclua o pagamento com este boleto em questão,
            já que poderá ocorrer um pagamento duplo para o mesmo participante. <br />
            Se você estiver experienciando erros em relação a este problema, entre em contato com a nossa equipe por email: famun@facamp.com.br
          </div>
          :
          null
        }

      </div>
    </>
  )
}

export default RequiresActionPayments

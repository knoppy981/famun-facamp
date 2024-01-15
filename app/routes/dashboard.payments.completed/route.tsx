import React from 'react'
import qs from "qs"
import { useOutletContext } from '@remix-run/react'

import { useUser } from '~/utils'

import { OutletType } from '../dashboard.payments/types'
import { HTMLLink } from '~/components/link'
import { FiCreditCard, FiExternalLink } from 'react-icons/fi/index.js'
import { getCurrentLocale } from '~/hooks/useCurrentLocale'

const CompletedPayments = () => {
  const { paymentsList }: OutletType = useOutletContext()
  const user = useUser()
  const locale = getCurrentLocale()

  return (
    <>
      {paymentsList && paymentsList.length > 0 ?
        <div className='overflow-container'>
          <table className='table'>
            <thead>
              <tr className="table-row example">
                <td className='table-cell'>
                  Pagamento
                </td>

                <td className='table-cell' style={{ paddingLeft: "30px" }}>
                  Valor
                </td>

                <td className='table-cell' style={{ paddingLeft: "30px" }}>
                  Recibo
                </td>

                <td className='table-cell'>
                  Data
                </td>
              </tr>
            </thead>

            <tbody>
              {paymentsList.map((item: typeof paymentsList[0], index) => {
                if (item.status !== "succeeded") return
                return (
                  <tr
                    className="table-row"
                    key={index}
                    aria-label={`Payment realized by user ${user.name}`}
                  >
                    <td className='table-cell'>
                      <div className='table-flex-cell'>
                        Inscrição de {item?.metadata?.paidUsersIds ? ` ${Object.keys(qs.parse(item?.metadata?.paidUsersIds)).length}x participante${Object.keys(qs.parse(item?.metadata?.paidUsersIds)).length > 1 ? "s" : ""}` : ''}
                      </div>
                    </td>

                    <td className='table-cell'>
                      <div className='table-flex-cell'>
                        <div className="secondary-button-box green-light">
                          <div>
                            {(item.amount / 100).toLocaleString(locale, { style: "currency", currency: item.currency })}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className='table-cell'>
                      <div className='table-flex-cell'>
                        <HTMLLink href={item?.receiptUrl as string | undefined} target="_blank" rel="noopener noreferrer">
                          <div className="secondary-button-box blue-light">
                            <div>
                              <FiExternalLink className='icon' />  Recibo
                            </div>
                          </div>
                        </HTMLLink>
                      </div>
                    </td>

                    <td className='table-cell'>
                      {new Date(item.created * 1000).toLocaleDateString()}
                    </td>
                  </tr>
                )
              }
              )}
            </tbody>
          </table>
        </div>
        :
        <h2 className="text w500">
          Ainda não recebemos nenhum pagamento :(
        </h2>
      }
    </>
  )
}

export default CompletedPayments

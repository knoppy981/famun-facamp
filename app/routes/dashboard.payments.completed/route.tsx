import React from 'react'
import qs from "qs"
import { useOutletContext } from '@remix-run/react'

import { useUser } from '~/utils'

import { OutletType } from '../dashboard.payments/utils/types'
import { HTMLLink } from '~/components/link'
import { FiExternalLink, FiInfo } from 'react-icons/fi/index.js'
import { getCurrentLocale } from '~/hooks/useCurrentLocale'
import PopoverTrigger from '~/components/popover/trigger'
import ParticipantsListPopover from './components/paidParticipantsListPopover'

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
                const data = parseObjectValues(item?.metadata)
                return (
                  <tr
                    className="table-row"
                    key={index}
                    aria-label={`Payment realized by user ${user.name}`}
                  >
                    <td className='table-cell'>
                      <div className='table-flex-cell'>
                        Inscrição de {data ? ` ${data.length}x participante${data.length as number > 1 ? "s" : ""}` : ''}

                        <PopoverTrigger label={<FiInfo className="icon" />}>
                          <ParticipantsListPopover ids={data.map(p => p.userId)} />
                        </PopoverTrigger>
                      </div>
                    </td>

                    <td className='table-cell'>
                      <div className='table-flex-cell'>
                        <div className="secondary-button-box green-light">
                          <div className='button-child'>
                            <>{(item.amount / 100).toLocaleString(locale, { style: "currency", currency: item.currency })}</>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className='table-cell'>
                      <div className='table-flex-cell'>
                        <HTMLLink href={item?.receiptUrl as string | undefined} target="_blank" rel="noopener noreferrer">
                          <div className="secondary-button-box blue-light">
                            <div className='button-child'>
                              <FiExternalLink className='icon' />  Recibo
                            </div>
                          </div>
                        </HTMLLink>
                      </div>
                    </td>

                    <td className='table-cell'>
                      <>
                        {new Date(item.created * 1000).toLocaleString('pt-BR', {
                          timeZone: 'America/Sao_Paulo',
                          year: 'numeric',
                          month: 'numeric',
                          day: 'numeric'
                        })}
                      </>
                    </td>
                  </tr>
                )
              }
              )}
            </tbody>
          </table>
        </div>
        :
        <h2 className="payments-warning text w500">
          Ainda não recebemos nenhum pagamento :(
        </h2>
      }
    </>
  )
}

function parseObjectValues(obj: any) {
  const parsedArray: {
    amount: string,
    currency: string,
    userId: string
  }[] = [];

  for (const key in obj) {
    if (obj.hasOwnProperty(key) && key !== "payerId") {
      const decoded = decodeURIComponent(obj[key]);

      parsedArray.push(qs.parse(decoded) as any);
    }
  }

  return parsedArray;
}

export default CompletedPayments

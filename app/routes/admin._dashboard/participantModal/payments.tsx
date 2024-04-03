import { FetcherWithComponents, useFetcher } from '@remix-run/react'
import qs from 'qs'
import React from 'react'
import Button from '~/components/button'
import { FiBell, FiCreditCard, FiExternalLink, FiFile, FiInfo, FiX } from "react-icons/fi/index.js";
import Link from '~/components/link';
import { getCurrentLocale } from '~/hooks/useCurrentLocale';
import Spinner from '~/components/spinner';
import ParticipantsList from '~/routes/dashboard.payments.completed/paidParticipantsList';
import PopoverTrigger from '~/components/popover/trigger';

const Payments = ({ stripeCustomerId, stripePaidId, userId }: { stripeCustomerId: string | null, stripePaidId: string | null, userId: string }) => {
  const fetcher = useFetcher<any>()
  const locale = getCurrentLocale()
  usePaymentIntents(stripeCustomerId, stripePaidId, fetcher)
  const [toggleFakePayment] = useFakePayment()

  return (
    <div className='admin-delegation-notification-container'>
      {fetcher.state !== "idle" ?
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
          <Spinner dim='32px' color='#fff' />
        </div>
        :
        <>
          <div className='text s2 w500'>Pagamento Recebido</div>
          {stripePaidId !== "fake_payment" && fetcher.data?.paymentIntent ?
            <div className={`admin-delegation-notification`}>
              <p className="text">
                Incrição paga, {" "}
                {new Date(fetcher.data?.paymentIntent.created * 1000).toLocaleString('pt-BR', {
                  timeZone: 'America/Sao_Paulo',
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric'
                })}
              </p>
            </div>
            : stripePaidId === "fake_payment" ?
              <div className="admin-delegation-notification">
                <p className='text italic'>
                  Inscrição foi paga manualmente
                </p>

                <div className="admin-delegation-documents-buttons-container">
                  <Button className='secondary-button-box red-dark' onPress={() => toggleFakePayment(userId, stripePaidId)}>
                    Desmarcar como pago
                  </Button>
                </div>
              </div>
              :
              <div className="admin-delegation-notification">
                <p className='text italic'>
                  Inscrição do participante ainda não foi paga
                </p>

                <div className="admin-delegation-documents-buttons-container">
                  <Button className='secondary-button-box green-dark' onPress={() => toggleFakePayment(userId, stripePaidId)}>
                    Marcar como pago
                  </Button>
                </div>
              </div>
          }

          <div className='text s2 w500'>Pagamentos Realizados (últimos 10 pagamentos)</div>
          {fetcher.data?.paymentsList?.length > 0 ?
            fetcher.data?.paymentsList?.map((item: any, index: number) => (
              <div className={`admin-delegation-notification`} key={index}>
                <div className='admin-delegation-notification-item'>
                  <PopoverTrigger label={<FiInfo className="icon" />}>
                    <ParticipantsList ids={item?.metadata?.paidUsersIds} />
                  </PopoverTrigger>

                  <p className="text">
                    Inscrição de {item?.metadata?.paidUsersIds ? ` ${Object.keys(qs.parse(item?.metadata?.paidUsersIds)).length}x participante${Object.keys(qs.parse(item?.metadata?.paidUsersIds)).length > 1 ? "s" : ""}` : ''}
                    {" (" + handlePaymentMethod(item.paymentMethod) + "), "}
                    {(item.amount / 100).toLocaleString(locale, { style: "currency", currency: item.currency })}
                  </p>
                </div>

                <p className="text italic">
                  {new Date(item.created * 1000).toLocaleString('pt-BR', {
                    timeZone: 'America/Sao_Paulo',
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric'
                  })}
                </p>
              </div>
            ))
            :
            <p className='text italic'>
              Participante não realizou nenhum pagamento
            </p>
          }
        </>
      }
    </div >
  )
}

function usePaymentIntents(stripeCustomerId: string | null, stripePaidId: string | null, fetcher: FetcherWithComponents<any>) {
  React.useEffect(() => {
    if (stripeCustomerId || stripePaidId) {
      const searchParams = new URLSearchParams([["stripeCustomerId", stripeCustomerId ?? ""], ["stripePaidId", stripePaidId === "fake_payment" ? "" : stripePaidId ?? ""]]);
      fetcher.load(`/api/admin/charges?${searchParams}`)
    }
  }, [])
}

function handlePaymentMethod(method: string) {
  switch (method) {
    case "card":
      return "Cartão"
    case "boleto":
      return "Boleto"
    default:
      return "Cartão"
  }
}

function useFakePayment(): [(userId: string, stripePaidId: string | null) => void, "idle" | "loading" | "submitting"] {
  const fetcher = useFetcher()

  const toggleFakePayment = (userId: string, stripePaidId: string | null) => {
    fetcher.submit(
      { stripePaidId, userId },
      { method: "post", preventScrollReset: true, navigate: false, action: "/api/admin/fakePayment" }
    )
  }

  return [toggleFakePayment, fetcher.state]
}

export default Payments
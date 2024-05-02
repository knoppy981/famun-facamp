import React from 'react'
import qs from 'qs'
import { FetcherWithComponents, useFetcher } from '@remix-run/react'

import { getCurrentLocale } from '~/hooks/useCurrentLocale';

import Button from '~/components/button'
import Spinner from '~/components/spinner';
import ParticipantsList from '~/routes/dashboard.payments.completed/paidParticipantsList';
import PopoverTrigger from '~/components/popover/trigger';
import ModalTrigger from '~/components/modalOverlay/trigger';
import Dialog from '~/components/dialog';
import TextField from '~/components/textfield';
import { Item, Select } from '~/components/select';
import { FiInfo } from "react-icons/fi/index.js";

const Payments = ({ stripeCustomerId, stripePaid, userId }: {
  stripeCustomerId: string | null,
  stripePaid: { createdAt: Date; amount: string; currency: string; isFake: boolean | null; } | null,
  userId: string
}) => {
  const fetcher = useFetcher<any>()
  const fakePaymentFetcher = useFetcher<any>()
  const locale = getCurrentLocale()
  usePaymentIntents(stripeCustomerId, fetcher)
  const [toggleFakePayment] = useFakePayment(fakePaymentFetcher)

  return (
    <div className='admin-delegation-notification-container'>
      {fetcher.state !== "idle" ?
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
          <Spinner dim='32px' color='#fff' />
        </div>
        :
        <>
          <div className='text s2 w500'>Pagamento Recebido</div>
          {stripePaid && !stripePaid?.isFake ?
            <div className={`admin-delegation-notification`}>
              <p className="text">
                Incrição paga, {" "}
                {new Date(stripePaid.createdAt).toLocaleString('pt-BR', {
                  timeZone: 'America/Sao_Paulo',
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric'
                })}
              </p>
            </div>
            : stripePaid?.isFake ?
              <div className="admin-delegation-notification">
                <p className='text italic'>
                  Inscrição foi paga manualmente, {(parseInt(stripePaid.amount) / 100).toLocaleString(locale, { style: "currency", currency: stripePaid.currency })}
                </p>

                <div className="admin-delegation-documents-buttons-container">
                  <Button className='secondary-button-box red-dark' onPress={() => toggleFakePayment(userId, stripePaid)}>
                    {fakePaymentFetcher.state !== "idle" ? <Spinner dim='18px' color='#fff' /> : null}
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
                  <ModalTrigger buttonClassName="secondary-button-box blue-dark" label="Marcar como pago" >
                    {(close: () => void) => <ManualPaymentModal userId={userId} close={close} toggleFakePayment={toggleFakePayment} stripePaid={stripePaid} fakePaymentFetcher={fakePaymentFetcher} />}
                  </ModalTrigger>
                </div>
              </div>
          }

          <div className='text s2 w500'>Pagamentos Realizados (últimos 10 pagamentos)</div>
          {fetcher.data?.paymentsList?.length > 0 ?
            fetcher.data?.paymentsList?.map((item: any, index: number) => {
              const parsed = qs.parse(item?.metadata?.data) as {
                payerId: string,
                payments: {
                  amount: string,
                  currency: string,
                  userId: string
                }[]
              }
              return (
                <div className={`admin-delegation-notification`} key={index}>
                  <div className='admin-delegation-notification-item'>
                    <PopoverTrigger label={<FiInfo className="icon" />}>
                      <ParticipantsList ids={item?.metadata?.paidUsersIds} />
                    </PopoverTrigger>

                    <p className="text">
                      Inscrição de {item?.metadata?.data ? ` ${parsed.payments.length}x participante${parsed.payments.length > 1 ? "s" : ""}` : ''}
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
              )
            })
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

function usePaymentIntents(stripeCustomerId: string | null, fetcher: FetcherWithComponents<any>) {
  React.useEffect(() => {
    if (stripeCustomerId) {
      const searchParams = new URLSearchParams([["stripeCustomerId", stripeCustomerId ?? ""]]);
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

function useFakePayment(fakePaymentFetcher: FetcherWithComponents<any>): [
  (
    userId: string,
    stripePaid: {
      createdAt: Date;
      amount: string;
      currency: string;
      isFake: boolean | null;
    } | null,
    payment?: {
      currency: string;
      amount: number;
    }
  ) => void,
] {
  const toggleFakePayment = (
    userId: string,
    stripePaid: { createdAt: Date; amount: string; currency: string; isFake: boolean | null; } | null,
    payment?: { currency: string, amount: number }
  ) => {
    if (stripePaid?.isFake || !stripePaid) {
      fakePaymentFetcher.submit(
        { userId, status: stripePaid?.isFake ? "fake" : "null", amount: payment?.amount ?? "", currency: payment?.currency ?? "" },
        { method: "post", preventScrollReset: true, navigate: false, action: "/api/admin/fakePayment" }
      )
    }
  }

  return [toggleFakePayment]
}

type ManualPaymentModalProps = {
  userId: string
  close: () => void,
  toggleFakePayment: (userId: string, stripePaid: {
    createdAt: Date;
    amount: string;
    currency: string;
    isFake: boolean | null;
  } | null, payment?: {
    currency: string;
    amount: number;
  }) => void,
  stripePaid: { createdAt: Date; amount: string; currency: string; isFake: boolean | null; } | null;
  fakePaymentFetcher: FetcherWithComponents<any>
}

const ManualPaymentModal = (props: ManualPaymentModalProps) => {
  const formatter = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const [value, setValue] = React.useState(formatter.format(0 / 100))
  const [currency, setCurrency] = React.useState("BRL")
  const handleInputChange = (e: any) => {
    let newValue = e.target.value.replace(/[^0-9]/g, '');
    let formattedValue = formatter.format(Number(newValue) / 100)
    setValue(formattedValue)
  }

  return (
    <Dialog maxWidth>
      <div className="dialog-title">
        Adicionar pagamento
      </div>

      <TextField
        className='primary-input-box'
        label='Valor'
        theme='dark'
        name='fake_payment_value'
        autoFocus
        value={value}
        onChange={handleInputChange}
        isInvalid={false}
        action={{}}
      />

      <Select
        className='primary-input-box'
        label='Moeda'
        theme='dark'
        name='currency'
        selectedKey={currency}
        onSelectionChange={selected => setCurrency(selected as string)}
        items={[{ id: "USD" }, { id: "BRL" }]}
        isInvalid={false}
        action={{}}
      >
        {(item: { id: string }) => <Item>{item.id}</Item>}
      </Select>

      <div className="dialog-subitem">
        Obs: Pagamentos confirmados manualmente no sistema não aparecem no Stripe
      </div>

      <Button
        className="secondary-button-box red-dark"
        onPress={() => {
          props.close()
        }}
      >
        Cancelar
      </Button>

      <Button className='secondary-button-box green-dark' onPress={() => props.toggleFakePayment(props.userId, props.stripePaid, { currency, amount: parseInt(value.replace(/[,.]/g, '')) })}>
        {props.fakePaymentFetcher.state !== "idle" ? <Spinner dim='18px' color='#fff' /> : null}
        Confirmar
      </Button>
    </Dialog>
  )
}

export default Payments
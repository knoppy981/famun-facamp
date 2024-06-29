import { useSearchParams } from "@remix-run/react";
import React from "react";

type PaymentType = {
  id: string;
  name: string;
  price: number;
  currency: string;
  type: "delegate" | "advisor";
  available: boolean;
}

export function handlePaymentsSelection(payments: PaymentType[] | undefined): [
  PaymentType[] | undefined, (value: boolean, key: string, currency: string) => void, number, string, boolean
] {
  const [searchParams] = useSearchParams()

  function handlePaymentSelection(add: boolean, key: string, currency: string) {
    if (!checkCurrency(currency)) return

    setSelectedPayments(prevArray => {
      if (add && !prevArray.some((item) => item.name === key)) {
        const payment = payments?.find(item => item.name === key)
        return payment ? [...prevArray, payment] : prevArray
      } else if (!add) {
        return prevArray.filter(item => item.name !== key)
      }
      return prevArray
    })
  }

  function checkCurrency(currency: string) {
    if (selectedPayments.length === 0) {
      return true
    }
    const selectedCurrency = selectedPayments[0].currency
    return selectedCurrency === currency
  }

  const [selectedPayments, setSelectedPayments] = React.useState<PaymentType[]>(payments?.filter(payment => searchParams.getAll("s").some(name => name === payment.name)) as PaymentType[])
  const [[price, currency], setPrice] = React.useState<[number, string]>([0, ""])
  const [isButtonDisabled, setIsButtonDisabled] = React.useState(false)

  React.useEffect(() => {
    const totalPrice = selectedPayments.reduce((acc, payment) => acc + payment.price, 0)
    setPrice([totalPrice, selectedPayments[0]?.currency ?? ""])
    setIsButtonDisabled(selectedPayments.length === 0)
  }, [selectedPayments])

  return [selectedPayments, handlePaymentSelection, price, currency, isButtonDisabled]
}

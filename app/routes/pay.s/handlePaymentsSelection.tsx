import { useSearchParams } from "@remix-run/react";
import React from "react";

export function handlePaymentsSelection(payments: {
  id: string;
  name: string;
  price: number;
  type: "delegate" | "advisor";
  available: boolean;
}[] | undefined): [
  string[], React.Dispatch<React.SetStateAction<string[]>>, number, boolean
] {
  const [searchParams] = useSearchParams();

  function getNamesWithAvailablePayments(names: string[]) {
    return names.filter(name => {
      return payments?.some(p => p.name === name && p.available);
    });
  }

  const [selectedPaymentsNames, setSelectedPaymentsNames] = React.useState(getNamesWithAvailablePayments(searchParams.getAll('s')))
  const [price, setPrice] = React.useState<number>(0)
  const [isButtonDisabled, setIsButtonDisabled] = React.useState(false)

  React.useEffect(() => {
    const sumPrices = payments?.reduce((sum, payment) => {
      if (selectedPaymentsNames.includes(payment.name)) {
        return sum + payment.price;
      }
      return sum;
    }, 0);

    setPrice(sumPrices ?? 0)

    setIsButtonDisabled(selectedPaymentsNames.length === 0)
  }, [selectedPaymentsNames])

  return [selectedPaymentsNames, setSelectedPaymentsNames, price, isButtonDisabled]
}

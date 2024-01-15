export function usePaymentsData(payments:
  {
    id: string;
    name: string;
    price: number;
    type: "delegate" | "advisor";
    available: boolean;
  }[]
  | undefined
): [number | undefined, number | undefined, string[] | undefined] {
  if (payments === undefined) return [undefined, undefined, undefined]

  const delegatesPaymentsCount = payments.reduce((totalCount, payment) => {
    if (payment.type === "delegate") {
      return totalCount + 1;
    }
    return totalCount;
  }, 0);

  const advisorPaymentsCount = payments.reduce((totalCount, payment) => {
    if (payment.type === "advisor") {
      return totalCount + 1;
    }
    return totalCount;
  }, 0);

  const paymentNames = payments
    .map(payment => payment.name);

  return [
    delegatesPaymentsCount > 0 ? delegatesPaymentsCount : undefined,
    advisorPaymentsCount > 0 ? advisorPaymentsCount : undefined,
    paymentNames
  ]
}
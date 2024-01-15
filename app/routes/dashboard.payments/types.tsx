import Stripe from "stripe";

export type OutletType = {
  requiredPayments: {
    id: string;
    name: string;
    price: number;
    currency: string,
    type: "delegate" | "advisor";
    available: boolean;
    expiresAt: Date,
    expired: boolean,
  }[] | undefined,
  paymentsList: {
    amount: number;
    currency: string;
    status: Stripe.Charge.Status;
    metadata: Stripe.Metadata;
    created: number;
    receiptUrl: string | null;
    paymentMethod: string | undefined;
  }[]
}

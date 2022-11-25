
/* ---------------------------------------> npm add stripe @stripe/stripe-js @stripe/react-stripe-js  <---------------------------------*/

import Stripe from 'stripe'
import { UtilDin, utilJSON, utilSelectPgto } from 'app/models/util.js'
import { json } from '@remix-run/node'
import { prisma } from "~/db.server";


const stripe = new Stripe("sk_test_51L58wIJJYWRor6C3AH8lSuAqAu01n6ey6AouMnQI2FYCYfujyAR1buA7qx9j5dROp0DxwCjFXRoCgM4N8U4Z5lX300sxFhU8GW")

export async function getAllTransacoes() {
  const paymentsIntents = await stripe.paymentIntents.search({ query: 'status:\'succeeded\'' })
  let dados = "";

  const dataArray = []

  for (const i in paymentsIntents.data) {
    const cobranca = paymentsIntents.data[i].charges.data[0];

    dados += `{"id_pgto":"${paymentsIntents.data[i].id}", "status":"${paymentsIntents.data[i].status}" ,"contestação":"${cobranca.disputed}","amount": "${paymentsIntents.data[i].amount}", 
        "cliente":"${cobranca.billing_details.name}","e-mail": "${cobranca.billing_details.email}", "telefone":"${cobranca.billing_details.phone}",
        "moedaPgto": "${paymentsIntents.data[i].currency}", "desc": "${paymentsIntents.data[i].description}", "pago": "${cobranca.paid}", ${utilSelectPgto(cobranca.payment_method_details)},
        "comprovantePgto": "${cobranca.receipt_url}", "id_balancaTransacoes" : "${cobranca.balance_transaction}"
      }`

    if (i < paymentsIntents["data"].length - 1) {
      dados += ",";
    }
  }

  const _data = utilJSON("pgto", dados)?.pgto

  return (_data)
}

export async function novaTransacao(data) {
  return stripe.paymentIntents.create({
    amount: data.paymentPrice,
    currency: "USD",
    description: data.paymentDescription,
    payment_method: data.paymentMethod,
    confirm: true,
  })
}

export async function criarMeioPagamento(data) {
  return stripe.createPaymentMethod({
    type: "card",
    card: data.elements
  })
}

export async function getUserPayments(userId) {
  return prisma.user.findUnique({
    where: {
			id: userId
		},
		select: {
			payments: true
		}
  })
}

export async function createPaymentIntent() {
  return await stripe.paymentIntents.create({
    amount: 4500,
    currency: 'brl',
    automatic_payment_methods: {
      enabled: true
    }
  })
}
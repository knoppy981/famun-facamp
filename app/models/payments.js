
/* ---------------------------------------> npm add stripe @stripe/stripe-js @stripe/react-stripe-js  <---------------------------------*/

import Stripe from 'stripe'
import { UtilDin, utilJSON, utilSelectPgto } from 'app/models/util.js'

const stripe = new Stripe("sk_test_51L58wIJJYWRor6C3AH8lSuAqAu01n6ey6AouMnQI2FYCYfujyAR1buA7qx9j5dROp0DxwCjFXRoCgM4N8U4Z5lX300sxFhU8GW")

<<<<<<< HEAD
export async function getAllTrancoes(){
=======
export async function getAllTransacoes() {
>>>>>>> 71aec5ca455c90dc2d4d7b19821000b288cc126f
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
  
    const _data = utilJSON("pgto",dados)?.pgto
  
    return (_data)
<<<<<<< HEAD
}

export async function novaTransacao(data){
        const pagamento = await stripe.paymentIntents.create({
            customer:null,
            amount : data.amount,
            currency: "USD",
            description: "Famum",
            payment_method: data.id,
            confirm: true,
        }, () => {
            try {
                res.json({
                    message: "Pagamento finalizado!!!",
                    sucess: true
                })
            } catch (error) {
                res.json({
                    message: "O pagamento falhou",
                    sucess: false
                })
            }
        })
=======
>>>>>>> 71aec5ca455c90dc2d4d7b19821000b288cc126f
}
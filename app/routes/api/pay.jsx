import { json } from "@remix-run/node"
import qs from 'qs'

import { novaTransacao } from "~/models/payments"

export const action = async ({ request }) => {
  const text = await request.text()
  const data = qs.parse(text)

  const transaction = await novaTransacao(data)
  console.log(transaction)

  return json({transaction})
}
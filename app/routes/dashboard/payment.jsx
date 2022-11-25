import React from 'react'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import { getAllTransacoes } from '~/models/payments'

export const loader = async ({request}) => {

  const transactions = await getAllTransacoes()
  console.log(transactions)
  return json({transactions})
} 

const payment = () => {

  const data = useLoaderData()

  return (
    <div>
      <pre>
        {JSON.stringify(data.transactions, null, 2)}
      </pre>
    </div>
  )
}

export default payment
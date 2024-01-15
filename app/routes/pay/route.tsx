import React from 'react'
import { Outlet } from '@remix-run/react'
import { LoaderFunctionArgs, json, redirect } from '@remix-run/node';

import { requireUserId } from '~/session.server';

import Link from '~/components/link'
import { FiArrowLeft } from "react-icons/fi/index.js";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  if (url.pathname === "/pay") return redirect("/pay/s")

  const userId = await requireUserId(request)
  return json({ userId })
};

const Join = () => {
  return (
    <div className='auth-wrapper'>
      <div className='return-link-wrapper'>
        <Link
          to={{
            pathname: '/dashboard/payments',
          }}
        >
          <FiArrowLeft /> Início
        </Link>
      </div>

      <Outlet />
    </div>
  )
}

export default Join

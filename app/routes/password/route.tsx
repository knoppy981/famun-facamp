import React from 'react'
import { Outlet } from '@remix-run/react'
import { LoaderFunctionArgs, json, redirect } from '@remix-run/node';

import { getUserId } from '~/session.server';

import Link from '~/components/link'
import { FiArrowLeft } from "react-icons/fi/index.js";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request)

  const url = new URL(request.url);
  if (url.pathname === "/password") return redirect("/password/request")

  return userId ? redirect('/') : url.pathname === "/password" ? redirect("/password/request") : json({})
}

const Password = () => {
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

export default Password


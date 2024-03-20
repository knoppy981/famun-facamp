import React from 'react'
import { Outlet, useSearchParams } from '@remix-run/react'
import Link from '~/components/link'
import { FiArrowLeft } from "react-icons/fi/index.js";
import { LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import { getUserId } from '~/session.server';
import { checkSubscriptionAvailability } from '~/models/configuration.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request)
  const isSubscriptionAvailable = await checkSubscriptionAvailability()

  const shouldRedirect = userId || !isSubscriptionAvailable

  return shouldRedirect ? redirect('/') : json({})
}

const Join = () => {
  const [searchParams] = useSearchParams();

  return (
    <div className='auth-wrapper'>
      <div className='return-link-wrapper'>
        <Link
          to={{
            pathname: '/login',
            search: searchParams.toString()
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

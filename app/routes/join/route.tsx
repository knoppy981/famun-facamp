import React from 'react'
import { Outlet, useSearchParams } from '@remix-run/react'
import Link from '~/components/link'
import { FiArrowLeft } from "react-icons/fi/index.js";

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

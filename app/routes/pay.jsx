import { useEffect, useState } from 'react'
import { json } from '@remix-run/node'
import { useLoaderData, useActionData, useSearchParams, Outlet } from '@remix-run/react'
import qs from "qs"

import { createPaymentIntent } from '~/stripe.server'
import { requireUser, requireDelegationId } from '~/session.server'
import { ensureStripeCostumer } from '~/models/user.server'
import { getRequiredPayments } from '~/models/payments.server'
import { useUser } from '~/utils'

import * as S from "~/styled-components/pay"
import LanguageMenu from '~/styled-components/components/dropdown/languageMenu'
import { FiArrowLeft} from 'react-icons/fi'
import Link from '~/styled-components/components/link'
/* import { useTranslation } from 'react-i18next' */

/* export const handle = {
  i18n: "translation"
}; */

const Pay = () => {
  /* const { t, i18n } = useTranslation("translation") */

  return (
    <S.Wrapper>
      <S.GoBackLinkWrapper>
        <Link
          to={{
            pathname: '/dashboard/payment',
          }}
        >
          <FiArrowLeft /> Início
        </Link>
      </S.GoBackLinkWrapper>

      <Outlet />
    </S.Wrapper>
  )
}

export default Pay
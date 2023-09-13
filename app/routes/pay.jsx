import { Outlet } from '@remix-run/react'

import * as S from "~/styled-components/pay"
import { FiArrowLeft} from 'react-icons/fi'
import Link from '~/styled-components/components/link'

const Pay = () => {
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
import { Outlet, useSearchParams } from "@remix-run/react";

import * as S from '~/styled-components/join'
import { FiArrowLeft } from "react-icons/fi";
import Link from "~/styled-components/components/link";

export const handle = {
  i18n: "translation"
};

const join = () => {

  /* const { t, i18n } = useTranslation("translation") */

  const [searchParams] = useSearchParams();

  return (
    <S.Wrapper>
      <S.GoBackLinkWrapper>
        <Link
          to={{
            pathname: '/login',
            search: searchParams.toString()
          }}
        >
          <FiArrowLeft /> Início
        </Link>
      </S.GoBackLinkWrapper>

      <Outlet />
    </S.Wrapper >
  )
}

export default join
import { Link, Outlet, useSearchParams } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useEffect } from "react";

import { getUserId } from "~/session.server";

import * as S from '~/styled-components/join'
import { FiSettings, FiHelpCircle, FiArrowLeft, } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import LanguageMenu from "~/styled-components/components/dropdown/languageMenu";

export const handle = {
  i18n: "translation"
};

const join = () => {

  /* const { t, i18n } = useTranslation("translation") */

  const [searchParams] = useSearchParams();

  return (
    <S.Wrapper>
      <S.ExternalButtonWrapper>
        <S.ExternalButton to={{
          pathname: '/login',
          search: searchParams.toString()
        }}>
          <FiArrowLeft /> Início
        </S.ExternalButton>
      </S.ExternalButtonWrapper>

      <LanguageMenu /* i18n={i18n} */ />

      <Outlet />
    </S.Wrapper >
  )
}

export default join
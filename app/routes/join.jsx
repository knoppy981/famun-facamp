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

      <S.Container>
        <S.TitleBox>
          <S.Title>
            FAMUN 2023
          </S.Title>

          <S.AuxDiv>
            <S.ArrowIconBox />

            <S.SubTitle>
              Inscrição
            </S.SubTitle>
          </S.AuxDiv>
        </S.TitleBox>

        <Outlet />
        {/* <div style={{position: 'absolute', bottom: 0, left: 0, height: '100px', width: '100px', background: 'red'}}/> */}
      </S.Container>
    </S.Wrapper >
  )
}

export default join
import { useState, useRef } from 'react'
import { useClickOutside } from '~/hooks/useClickOutside'
import { useFetcher } from '@remix-run/react'

import { FiGlobe } from 'react-icons/fi';
import * as S from "./index"

const LanguageMenu = ({ i18n }) => {

  const lngs = i18n.options.supportedLngs.slice(0, -1) || []
  const updateI18n = useFetcher()
  const handleLanguage = async (e) => {
    e.preventDefault();
    i18n.changeLanguage(e.target.value);
    updateI18n.submit(
      { locale: e.target.value, url: pathname },
      { method: "post", action: "/api/updateI18n" }
    );
  }

  const [lngMenuOpen, setLngMenuOpen] = useState(false)
  const lngMenuRef = useRef(null)
  useClickOutside(lngMenuRef, () => setLngMenuOpen(false))

  return (
    <S.LangauegButtonWrapper ref={lngMenuRef} >
      <S.LanguageButton onClick={() => setLngMenuOpen(!lngMenuOpen)}>
        {i18n.language}<FiGlobe />
      </S.LanguageButton>

      <S.Reference open={lngMenuOpen} />
      <S.Container open={lngMenuOpen}>
        <S.Menu active height={'200px'}>
          <S.Item noHover>
            Alterar Idioma
          </S.Item>

          <S.MaxHeightMenu>
            {lngs.map((item) => {
              let flagCode = item.slice(-2).toLowerCase()
              return (
                <S.Item key={`${item}-lng-option`} height={'30px'}>
                  <S.Button onClick={handleLanguage} value={item} key={`${item}-language-item`}>
                    <S.NacionalityFlag className={`flag-icon flag-icon-${flagCode}`} />
                    {item}
                  </S.Button>
                </S.Item>
              )
            })}
          </S.MaxHeightMenu>
        </S.Menu>
      </S.Container>
    </S.LangauegButtonWrapper>
  )
}

export default LanguageMenu
import { useState, useRef } from 'react'
import { useClickOutside } from '~/hooks/useClickOutside'
import { useFetcher } from '@remix-run/react'
import { AnimatePresence, motion } from 'framer-motion';

import { FiGlobe } from 'react-icons/fi';
import * as S from "./elements"

const LanguageMenu = ({ i18n }) => {

  const lngs = i18n?.options.supportedLngs.slice(0, -1)
  const updateI18n = useFetcher()
  const handleLanguage = async (e) => {
    e.preventDefault();
    i18n?.changeLanguage(e.target.value);
    updateI18n.submit(
      { locale: e.target.value, url: pathname },
      { method: "post", action: "/api/updateI18n" }
    );
  }

  const [open, setOpen] = useState(false)
  const lngMenuRef = useRef(null)
  useClickOutside(lngMenuRef, () => setOpen(false))

  const menu = {
    closed: {
      scale: 0,
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
    open: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.3,
        delayChildren: 0.2,
        staggerChildren: 0.05,
      },
    },
  }

  const arrow = {
    variants: {
      closed: { opacity: 0 },
      open: { opacity: 1 },
    },
    transition: { duration: 0.2 },
  }

  const menuItem = {
    variants: {
      closed: { x: -16, opacity: 0 },
      open: { x: 0, opacity: 1 },
    },
    transition: { opacity: { duration: 0.2 } },
  }

  return (
    <S.Wrapper ref={lngMenuRef} >
      <S.ToggleButton onClick={() => setOpen(!open)}>
        {i18n?.language ?? 'pt-BR'}<FiGlobe />
      </S.ToggleButton>

      <AnimatePresence>
        {open &&
          <S.Container
            open={open}
            animate={open ? "open" : "closed"}
            initial="closed"
            exit="closed"
            variants={menu}
          >
            <S.Arrow
              {...arrow}
            />

            <S.Title /* {...menuItem} */ noHover>
              Alterar Idioma
            </S.Title>

            {/* lngs? */["pt-BR", "EN-us", "ES-es"].map((item, index) => {
              let flagCode = item.slice(-2).toLowerCase()
              return (
                <S.Item
                  key={`${item}-lng-option`}
                  {...menuItem}
                >
                  <S.Button onClick={handleLanguage} value={item} key={`${item}-language-item`}>
                    <S.NacionalityFlag className={`flag-icon flag-icon-${flagCode}`} />
                    {item}
                  </S.Button>
                </S.Item>
              )
            })}
          </S.Container>
        }
      </AnimatePresence>
    </S.Wrapper >
  )
}

export default LanguageMenu
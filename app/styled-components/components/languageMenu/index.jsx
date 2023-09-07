import React from 'react'

import * as S from './elements'
import PopoverTrigger from '~/styled-components/components/popover/popoverTrigger';
import Dialog from '~/styled-components/components/dialog';
import Button from '../button';
import { FiGlobe } from 'react-icons/fi';

const LanguageMenu = ({ i18n }) => {
  return (
    <S.Wrapper>
      <PopoverTrigger
        label={<>{i18n?.language ?? 'pt-BR'}<FiGlobe /></>}
        isNonModal
      >
        <Dialog>
          <S.Title>
            Alterar Idioma
          </S.Title>

          {/* lngs? */["pt-BR", "en-US", "es-ES"].map((item, index) => {
            let flagCode = item.slice(-2).toLowerCase()
            return (
              <S.Item key={index}>
                <Button>
                  <S.NacionalityFlag className={`flag-icon flag-icon-${flagCode}`} />
                  {item}
                </Button>
              </S.Item>
            )
          })}
        </Dialog>
      </PopoverTrigger>
    </S.Wrapper>
  )
}

export default LanguageMenu
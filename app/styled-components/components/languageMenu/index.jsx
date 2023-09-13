import * as S from './elements'
import PopoverTrigger from '~/styled-components/components/popover/popoverTrigger';
import Dialog from '~/styled-components/components/dialog';
import Button from '../button';
import { FiGlobe } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const LanguageMenu = ({ i18n }) => {

  const lngs = i18n?.options.supportedLngs.slice(0, -1)
  const handleLanguage = async (lng) => {
    i18n?.changeLanguage(lng);
    /* updateI18n.submit(
      { locale: e.target.value, url: pathname },
      { method: "post", action: "/api/updateI18n" }
    ); */
  }

  return (
    <S.Wrapper>
      <PopoverTrigger
        label={<>{i18n?.language ?? 'pt-BR'}<FiGlobe /></>}
      >
        <Dialog>
          <S.Title>
            Alterar Idioma
          </S.Title>

          {lngs?.map((item, index) => {
            let flagCode = item.slice(-2).toLowerCase()
            return (
              <S.Item key={index} isSelected={item === i18n?.language}>
                <Button onPress={() => handleLanguage(item)}>
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
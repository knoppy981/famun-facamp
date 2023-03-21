import { useState } from 'react'

import * as S from './elements'
import { isoCountries } from '~/data/ISO-3661-1'

const Nacionality = ({ data }) => {

  const [focus, setFocus] = useState(false)
  const [flag, setFlag] = useState(data.nacionality ?? "Brazil")

  return (
    <>
      <S.Title>
        Nacionalidade
      </S.Title>

      <S.SubTitle>
        Escolha seu país de nascimento
      </S.SubTitle>

      <S.Container
        onClick={() => setFocus(true)}
        focused={focus}
      >
        <S.NacionalityFlag
          className={`flag-icon flag-icon-${isoCountries[flag].toLowerCase()}`}
        />

        <S.Select
          defaultValue={data.nacionality ?? "Brazil"}
          onChange={e => { setFlag(e.target.value); setFocus(false) }}
          name="nacionality"
          onBlur={() => setFocus(false)}
        >
          {Object.keys(isoCountries).map((item, index) => (
            <S.Option key={`country-${item}`}>{item}</S.Option>
          ))}
        </S.Select>
      </S.Container>
    </>
  )
}

export default Nacionality
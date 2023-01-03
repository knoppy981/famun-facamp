import { useState } from 'react'

import * as S from './elements'

import br from '~/images/flag-icons/br.svg'
import de from '~/images/flag-icons/de.svg'
import es from '~/images/flag-icons/es.svg'
import fr from '~/images/flag-icons/fr.svg'
import mx from '~/images/flag-icons/mx.svg'
import pt from '~/images/flag-icons/pt.svg'
import us from '~/images/flag-icons/us.svg'

const Nacionality = ({ data }) => {

  const flagIcons = {
    "Brasil": br,
    "Alemanha": de,
    "Espanha": es,
    "Franca": fr,
    "Mexico": mx,
    "Portugal": pt,
    "Estados Unidos": us,
  }

  const [flag, setFlag] = useState(data.nacionality ?? "Brasil")
  const [focus, setFocus] = useState(false)

  return (
    <>
      <S.Title style={{ marginTop: '40px' }}>
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
          style={{
            backgroundImage: `url(${flagIcons[flag]})`,
          }}
        />

        <S.Select
          value={flag}
          onChange={e => { setFlag(e.target.value); setFocus(false) }}
          name="nacionality"
          onBlur={() => setFocus(false)}
        >

          <S.Option value={"Brasil"}>Brasil</S.Option>
          <S.Option value={"Portugal"}>Portugal</S.Option>
          <S.Option value={"Franca"}>França</S.Option>
          <S.Option value={"Estados Unidos"}>Estados Unidos</S.Option>
          <S.Option value={"Espanha"}>Espanha</S.Option>
          <S.Option value={"Alemanha"}>Alemanha</S.Option>
          <S.Option value={"Mexico"}>México</S.Option>
        </S.Select>
      </S.Container>
    </>
  )
}

export default Nacionality
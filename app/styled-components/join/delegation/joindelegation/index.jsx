import { useState, useEffect, useRef } from 'react'
import { useFetcher } from '@remix-run/react'

import * as S from './elements'
import { FiCheck, FiX } from 'react-icons/fi'
import Spinner from '~/styled-components/components/spinner'

const JoinDelegation = ({ data, actionData }) => {
  const inputRef = useRef(null)
  const [value, setValue] = useState("")
  const [label, setLabel] = useState("")
  const [valid, setValid] = useState(false)
  const searchDelegation = useFetcher()

  const handleChange = (event) => {
    setValue(event.target.value)
    if (inputRef.current.value.length === 6) {
      searchDelegation.submit(
        { delegationCode: event.target.value },
        { method: "post", action: "/api/delegationCode" }
      );
    }
  }

  useEffect(() => {
    setLabel(
      searchDelegation.state !== "idle" ?
        "Procurando..." : searchDelegation?.data?.delegation && inputRef.current.value.length === 6 ?
          "Delegação do " + searchDelegation?.data?.delegation.school : searchDelegation?.data?.errors ?
            searchDelegation?.data?.errors["delegation" || "code"] : "Exemplo : A1B2C3"
    )
    setValid((searchDelegation?.data?.delegation && inputRef.current.value.length === 6) ? true : false)
  }, [searchDelegation, value])

  return (
    <>
      <S.Title>
        Entrar em uma delegação
      </S.Title>

      <S.SubTitle>
        Digite o código da sua delegação abaixo ou peça um convite para o chefe da sua delegação
      </S.SubTitle>

      <S.Wrapper>
        <S.Container>
          <S.Label>
            Código :
          </S.Label>

          <S.InputBox>
            <S.Input
              ref={inputRef}
              value={value}
              id="delegationCode"
              name="delegationCode"
              type="string"
              autoFocus={true}
              onChange={handleChange}
            />
            <S.StatusIcon color={searchDelegation?.data?.errors ? "#A7A7A7" : "green"}>
              {searchDelegation?.data?.errors ? <FiX /> : (searchDelegation?.data?.delegation && value.length === 6) ? <FiCheck /> : null}
            </S.StatusIcon>
          </S.InputBox>

          <S.Button name="action" value="next" type="submit" disabled={!valid}>
            Entrar {valid && searchDelegation.state !== 'idle' && <Spinner dim={18} />}
          </S.Button>
        </S.Container>

        <S.Status>
          {actionData?.errors?.joinDelegation ?? label}
        </S.Status>
      </S.Wrapper>
    </>
  )
}

export default JoinDelegation
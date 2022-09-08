import React from 'react'

import * as S from '~/styled-components/dashboard/home/delegation'

const Delegation = () => {

  const data = ["Chefe", "Professor", "Professor", "Professor", "Professor", "Delegado", "Delegado", "Delegado", "Delegado", "Delegado", "Delegado", "Delegado"]

  return (
    <S.Wrapper>
      <S.Title>
        Delegação Brasileira
      </S.Title>
      <S.Subtitle>
        Colégio Notre Dame Campinas
      </S.Subtitle>
      <S.GridWrapper>
        <S.GridTitle>
          Delegados :
        </S.GridTitle>
        <S.DelegatesGrid>
          {data.map((item, index) => (
            <S.Delegate
              role={item}
            >
              {item}
            </S.Delegate>
          ))}
        </S.DelegatesGrid>
      </S.GridWrapper>
    </S.Wrapper>
  )
}

export default Delegation
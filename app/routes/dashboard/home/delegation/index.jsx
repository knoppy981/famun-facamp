import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { requireDelegation } from '~/session.server';
import * as S from '~/styled-components/dashboard/home/delegation'

export const loader = async ({ request, params }) => {
  const delegation = await requireDelegation(request)
  return json({ delegation });
}

const Delegation = () => {

  const data = useLoaderData()
  const delegationUsers = data.delegation.users

  return (
    <S.Wrapper>
      <S.Title>
        Delegação Brasileira,
      </S.Title>
      <S.Subtitle>
        Colégio Notre Dame Campinas
      </S.Subtitle>
      <S.GridWrapper>
        <S.GridTitle>
          Delegados :
        </S.GridTitle>
        <S.DelegatesGrid>
          {delegationUsers.map((item, index) => (
            <S.Delegate
              role={item.role}
            >
              {index + 1 + "."} {" "} {item.name}
            </S.Delegate>
          ))}
        </S.DelegatesGrid>
      </S.GridWrapper>
    </S.Wrapper>
  )
}

export default Delegation
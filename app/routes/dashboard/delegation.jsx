import { json } from '@remix-run/node';
import { useOutletContext, useActionData, useLoaderData } from '@remix-run/react';

import { requireDelegation } from '~/session.server';
import { generateDelegationInviteLink } from '~/models/delegation.server';

import * as S from '~/styled-components/dashboard/delegation'
import { BsPerson } from 'react-icons/bs';

export const action = async ({ request }) => {
  const formData = await request.formData()
  const delegationCode = formData.get("delegationCode")

  const link = await generateDelegationInviteLink(delegationCode)
  console.log(link)

  return json({ link })
}

export const loader = async ({ request }) => {
  const delegation = await requireDelegation(request)
  return json({ delegation });
}

const Delegation = () => {

  const { delegation } = useLoaderData()
  const actionData = useActionData()
  const { user } = useOutletContext()

  return (
    <S.Wrapper>
      <S.SubTitle>
        Delegação do
      </S.SubTitle>
      <S.Title>
        {delegation.school}
      </S.Title>

      <S.DelegationContainer>
        <S.DelegatesListWrapper>
          <S.Delegate example={true}>
            <S.DelegateName>
              Nome
            </S.DelegateName>
            <S.DelegateEmail>
              Posição
            </S.DelegateEmail>
            <S.DelegateJoinDate>
              Entrou em
            </S.DelegateJoinDate>
            <S.DelegateSubscription>
              Inscrição
            </S.DelegateSubscription>
          </S.Delegate>

          <S.DelegatesList>
            <S.Delegate user={delegation.delegationLeader.id === user.id}>
              <S.DelegateName>
                {delegation.delegationLeader.name}
              </S.DelegateName>
              <S.DelegateEmail>
                Chefe
              </S.DelegateEmail>
              <S.DelegateJoinDate>
                {delegation.createdAt.split("T")[0]}
              </S.DelegateJoinDate>
              <S.DelegateSubscription>

              </S.DelegateSubscription>
            </S.Delegate>

            {delegation.delegationAdvisor.map((item, index) => {
              if (item.user.id === delegation.delegationLeader.id) return undefined

              return (
                <S.Delegate key={index} user={item.user.id === user.id}>
                  <S.DelegateName>
                    {item.user.name}
                  </S.DelegateName>
                  <S.DelegateEmail>
                    {item.advisorRole}
                  </S.DelegateEmail>
                  <S.DelegateJoinDate>
                    {item.createdAt.split("T")[0]}
                  </S.DelegateJoinDate>
                  <S.DelegateSubscription>

                  </S.DelegateSubscription>
                </S.Delegate>
              )
            })}

            {delegation.delegate.map((item, index) => {
              if (item.user.id === delegation.delegationLeader.id) return undefined

              return (
                <S.Delegate key={index} user={item.user.id === user.id}>
                  <S.DelegateName>
                    {item.user.name}
                  </S.DelegateName>
                  <S.DelegateEmail>
                    Delegado
                  </S.DelegateEmail>
                  <S.DelegateJoinDate>
                    {item.createdAt.split("T")[0]}
                  </S.DelegateJoinDate>
                  <S.DelegateSubscription>

                  </S.DelegateSubscription>
                </S.Delegate>
              )
            })}
          </S.DelegatesList>
        </S.DelegatesListWrapper>
      </S.DelegationContainer>
    </S.Wrapper>
  )
}

export default Delegation
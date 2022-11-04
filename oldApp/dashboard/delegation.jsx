import { json } from '@remix-run/node';
import { Form, useActionData, useLoaderData } from '@remix-run/react';

import { requireDelegation } from '~/session.server';
import { generateDelegationInviteLink } from '~/models/delegation.server';

import * as S from '~/styled-components/dashboard/delegation'
import { BsPerson } from 'react-icons/bs';

export const action = async ({ request }) => {
  const formData = await request.formData()
  const delegationCode = formData.get("delegationCode")
  
  const link = await generateDelegationInviteLink(delegationCode)
  console.log(link)

  return json({link})
}

export const loader = async ({ request }) => {
  const delegation = await requireDelegation(request)
  return json({ delegation });
}

const Delegation = () => {

  const { delegation } = useLoaderData()
  const actionData = useActionData()

  return (
    <S.Wrapper>
      <S.TitleBox>
        <S.Title>
          Delegação Brasileira,
        </S.Title>

        <S.SubTitle>
          Colégio Notre Dame Campinas
        </S.SubTitle>
      </S.TitleBox>

      <S.DelegationContainer>
        <S.DelegationDataWrapper>
          <Form method='post'>
            <input type='hidden' name="delegationCode" value={delegation.code} />
            <button type='submit'>
              Get Link
            </button>
            <div>
              <h2>
                {actionData?.link}
              </h2>
            </div>
          </Form>
        </S.DelegationDataWrapper>

        <S.DelegatesListWrapper>
          <S.Delegate example={true}>
            <S.DelegateName>
              Nome
            </S.DelegateName>
            <S.DelegateEmail>
              E-mail
            </S.DelegateEmail>
            <S.DelegateJoinDate>
              Entrou em
            </S.DelegateJoinDate>
            <S.DelegateSubscription>
              Inscrição
            </S.DelegateSubscription>
          </S.Delegate>

          <S.DelegatesList>
            {Array.from({ length: 7 }).map((item, index) => (
              <S.Delegate
                key={index}
              /* role={item.role} */
              >
                <S.DelegateName>
                  Roberto Carlos
                </S.DelegateName>
                <S.DelegateEmail>
                  roberto.carlos@gmail.com
                </S.DelegateEmail>
                <S.DelegateJoinDate>
                  29 de Outubro de 2022
                </S.DelegateJoinDate>
                <S.DelegateSubscription>

                </S.DelegateSubscription>
              </S.Delegate>
            ))}
          </S.DelegatesList>
        </S.DelegatesListWrapper>
      </S.DelegationContainer>
    </S.Wrapper>
  )
}

export default Delegation
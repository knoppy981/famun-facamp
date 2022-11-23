import { useState, useEffect } from 'react';
import { json } from '@remix-run/node';
import { Form, useOutletContext, useActionData, useLoaderData, useTransition } from '@remix-run/react';

import { requireDelegation } from '~/session.server';
import { generateDelegationInviteLink } from '~/models/delegation.server';

import * as S from '~/styled-components/dashboard/delegation'
import { FiMail, FiX } from 'react-icons/fi';

export const action = async ({ request }) => {
  const formData = await request.formData()
  const delegationCode = formData.get("delegationCode")
  if (delegationCode === undefined || null || "" || delegationCode?.length !== 6 ) 
    return json({
      error: {delegationCode: "Invalid delegation code"},
      status: 404
    })
  
  const inviteLink = await generateDelegationInviteLink(delegationCode)

  return json({ inviteLink })
}

export const loader = async ({ request }) => {
  const delegation = await requireDelegation(request)
  return json({ delegation });
}

const Delegation = () => {

  const { delegation } = useLoaderData()
  const actionData = useActionData()
  const { user } = useOutletContext()
  const transition = useTransition()

  const [shadowBackground, setShadowBackground] = useState(false)

  useEffect(() => {
    if (actionData?.inviteLink) {
      setShadowBackground(true)
    }
  }, [actionData])

  return (
    <S.Wrapper>
      <S.ShadowBackground show={shadowBackground}>
        <S.ClickableBackground onClick={() => setShadowBackground(false)} />
        <S.BackgroundContainer>
          <S.BackgroundCloseButton onClick={() => setShadowBackground(false)}>
            <FiX />
          </S.BackgroundCloseButton>

          <S.BackgroundTitle>
            Compartilhe esse link para convidar outros integrantes
          </S.BackgroundTitle>
          <S.LinkBox 
            value={actionData?.inviteLink}
          />

          <S.BackgroundTitle>
            Ou compartilhe o código para ser usado na inscrição
          </S.BackgroundTitle>
          <S.BackgroundData>
            A1B2C3
          </S.BackgroundData>
        </S.BackgroundContainer>
      </S.ShadowBackground>

      <S.Nav>
        <S.TitleBox>
          <S.SubTitle>
            Delegação do
          </S.SubTitle>
          <S.Title>
            {delegation.school}
          </S.Title>
        </S.TitleBox>
        <S.NavMenu>
          <Form method="post">
            <input type="hidden" name="delegationCode" value={delegation.code}/>
            <S.NavItem>
              <FiMail />
              <p> Convidar </p>
            </S.NavItem>
          </Form>
        </S.NavMenu>
      </S.Nav>

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
import { useState, useEffect, useRef } from 'react';
import { json } from '@remix-run/node';
import { Form, useOutletContext, useActionData, useLoaderData, useFetcher } from '@remix-run/react';

import { requireDelegation } from '~/session.server';
import { generateDelegationInviteLink } from '~/models/delegation.server';

import * as S from '~/styled-components/dashboard/delegation'
import * as D from '~/styled-components/components/dropdown'
import { FiMail, FiExternalLink, FiCheck } from 'react-icons/fi';
import { useClickOutside } from "~/hooks/useClickOutside";

export const action = async ({ request }) => {
  const formData = await request.formData()
  const delegationCode = formData.get("delegationCode")
  if (delegationCode === undefined || null || "" || delegationCode?.length !== 6)
    return json({
      error: { delegationCode: "Invalid delegation code" },
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

  const [inviteMenuOpen, setInviteMenuOpen] = useState(false)
  const inviteMenuRef = useRef(null)
  useClickOutside(inviteMenuRef, () => setInviteMenuOpen(false))

  /* useEffect(() => {
    console.log(inviteMenuRef.current?.offsetHeight)
  }, [inviteMenuRef]) */

  const updateInviteLink = useFetcher()
  const handleUpdateInviteLink = async (e) => {
    e.preventDefault();
    updateInviteLink.submit(e.currentTarget, { replace: true })
  }

  return (
    <S.Wrapper>
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
          <S.NavItem ref={inviteMenuRef}>
            <S.NavIcon onClick={() => setInviteMenuOpen(!inviteMenuOpen)}>
              <FiMail />
              <p> Convidar </p>
            </S.NavIcon>

            <D.Reference open={inviteMenuOpen} />
            <D.Container open={inviteMenuOpen} xPosition={inviteMenuRef.current?.offsetHeight}>
              <D.Menu>
                <D.Title>
                  Compartilhe o link abaixo <FiExternalLink />
                </D.Title>

                <D.Link
                  readOnly
                  value={delegation.inviteLink}
                />

                <D.DForm style={{ padding: '10px 0 0 10px' }} action="/api/updateInviteLink" method="post">
                  <input type="hidden" name="delegationCode" value={delegation.code} />

                  <D.ColorItem color={updateInviteLink.data ? 'green' : 'blue'} type="submit" onClick={handleUpdateInviteLink} disabled={updateInviteLink.state !== "idle"}>
                    {updateInviteLink.state === "idle" ? 'Gerar novo link' : 'Alterando'} {updateInviteLink.data && <FiCheck />}
                  </D.ColorItem>
                </D.DForm>

                <D.Title>
                  ou utilize este código na inscrição
                </D.Title>

                <D.Data>
                  {delegation.code}
                </D.Data>
              </D.Menu>
            </D.Container>
          </S.NavItem>
        </S.NavMenu>
      </S.Nav>

      <S.DelegationContainer>
        <S.DelegatesListWrapper>
          <S.DelegateContainer example>
            <S.Delegate>
              <S.Name>
                Nome
              </S.Name>
              <S.Role example>
                Posição
              </S.Role>
              <S.JoinDate>
                Entrou em
              </S.JoinDate>
            </S.Delegate>
          </S.DelegateContainer>

          <S.DelegatesList>

            {delegation.participants.map((item, index) => {
              const leader = item.leader
              return (
                <S.DelegateContainer key={`delegation-user-${index}`}>
                  <S.Delegate key={index} user={item.id === user.id}>
                    <S.Name>
                      {item.name}
                      {leader && <S.Item color="red"> Líder da Delegação </S.Item>}
                    </S.Name>
                    <S.Role>
                      <S.Item color={item.delegate ? 'blue' : 'green'}>
                        {item.delegate ? "Delegado" : item.delegationAdvisor.advisorRole}
                      </S.Item>
                    </S.Role>
                    <S.JoinDate>
                      {item.createdAt.split("T")[0]}
                    </S.JoinDate>
                  </S.Delegate>
                </S.DelegateContainer>
              )
            })}
          </S.DelegatesList>
        </S.DelegatesListWrapper>
      </S.DelegationContainer>
    </S.Wrapper>
  )
}

export default Delegation
import { useState, useRef } from 'react';
import { json } from '@remix-run/node';
import { useMatches, useCatch, useLoaderData, useFetcher } from '@remix-run/react';
import { AnimatePresence, motion } from "framer-motion";

import { getDelegationId } from '~/session.server';
import { useUser, safeRedirect, useUserType } from '~/utils';
import { useClickOutside } from "~/hooks/useClickOutside";

import * as S from '~/styled-components/dashboard/delegation'
import * as D from '~/styled-components/components/dropdown'
import * as E from '~/styled-components/error'
import { FiMail, FiExternalLink, FiCheck } from 'react-icons/fi';
import { getDelegationById } from '~/models/delegation.server';

export const loader = async ({ request }) => {
  const delegationId = await getDelegationId(request)

  if (!delegationId) throw json({ errors: { delegationId: "No delegation found" } }, { status: 404 });

  const delegation = await getDelegationById(delegationId)

  return json({ delegation });
}

const ParticipantsPage = ({ participants }) => {
  const user = useUser()

  return (
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
        {participants.map((item, index) => {
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
  )
}

const DataPage = ({ delegation }) => {
  const userType = useUserType()

  return (
    <S.DataPageWrapper>
      <S.DataLine>
        <S.DataContainer first>
          <S.DataTitle>
            Escola / Universidade
          </S.DataTitle>

          <S.Data>{delegation.school}</S.Data>
        </S.DataContainer>

        <S.DataContainer>
          <S.DataTitle>
            Número de telefone
          </S.DataTitle>

          <S.Data>{delegation.schoolPhoneNumber}</S.Data>
        </S.DataContainer>
      </S.DataLine>

      <S.DataLine>
        <S.DataContainer first>
          <S.DataTitle>
            País
          </S.DataTitle>

          <S.Data>{delegation.address.country}</S.Data>
        </S.DataContainer>

        <S.DataContainer>
          <S.DataTitle>
            Cidade
          </S.DataTitle>

          <S.Data>{delegation.address.city}</S.Data>
        </S.DataContainer>

        <S.DataContainer>
          <S.DataTitle>
            Endereço
          </S.DataTitle>

          <S.Data>{delegation.address.address}</S.Data>
        </S.DataContainer>

        <S.DataContainer>
          <S.DataTitle>
            CEP
          </S.DataTitle>

          <S.Data>{delegation.address.cep}</S.Data>
        </S.DataContainer>
      </S.DataLine>
    </S.DataPageWrapper>
  )
}

const Delegation = () => {

  const { delegation } = useLoaderData()

  const [menu, setMenu] = useState("participants")

  const [inviteMenuOpen, setInviteMenuOpen] = useState(false)
  const inviteMenuRef = useRef(null)
  useClickOutside(inviteMenuRef, () => setInviteMenuOpen(false))

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

            <D.Container open={inviteMenuOpen}>
              <D.Menu active>
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

      <S.Menu>
        <S.MenuItem active={menu === "participants"} onClick={() => setMenu("participants")} >
          Participantes
          {menu === "participants" ? <S.UnderLine layoutId="paymentPageUnderline" /> : null}
        </S.MenuItem>

        <S.MenuItem active={menu === "data"} onClick={() => setMenu("data")} >
          Dados
          {menu === "data" ? <S.UnderLine layoutId="paymentPageUnderline" /> : null}
        </S.MenuItem>
      </S.Menu >

      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={menu}
          initial={{ x: menu === "participants" ? "-10%" : "10%", opacity: 0 }}
          animate={{ x: "0", opacity: 1 }}
          exit={{ x: menu === "participants" ? "-10%" : "10%", opacity: 0 }}
          transition={{ duration: .4, ease: "easeInOut" }}
        >
          {menu === "participants" ?
            <ParticipantsPage
              participants={delegation.participants}
              key="participants"
            /> :
            <DataPage
              key="data"
              delegation={delegation}
            />
          }
        </motion.div>
      </AnimatePresence>
    </S.Wrapper>
  )
}

export function CatchBoundary() {
  const caught = useCatch();
  const matches = useMatches()

  if (caught.status === 404) {
    return (
      <S.Wrapper>
        <S.Title>
          Delegation
        </S.Title>

        <E.Message>

          {caught.data.errors.delegationId}
          <E.GoBacklink to={`/join/delegation?${new URLSearchParams([["redirectTo", safeRedirect(matches[1].pathname)]])}`}>
            Join a Delegation
          </E.GoBacklink>
        </E.Message>

      </S.Wrapper>
    );
  }

  throw new Error(`Unsupported thrown response status code: ${caught.status}`);
}

export function ErrorBoundary({ error }) {
  if (error instanceof Error) {
    return (
      <S.Wrapper>
        <S.Title>
          Unknown error
        </S.Title>

        <E.Message>
          {error.message} <E.GoBacklink to='/'>Voltar para página inicial</E.GoBacklink>
        </E.Message>
      </S.Wrapper>
    );
  }
  return <E.Message>Oops, algo deu errado!</E.Message>;
}

export default Delegation
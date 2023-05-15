import { useState, useRef, useEffect } from 'react';
import { json } from '@remix-run/node';
import { useMatches, useCatch, useLoaderData, useFetcher, useActionData, useTransition, useSubmit } from '@remix-run/react';
import { AnimatePresence, motion } from "framer-motion";
import qs from 'qs'

import { getDelegationId } from '~/session.server';
import { useUser, safeRedirect, useUserType } from '~/utils';
import { useClickOutside } from "~/hooks/useClickOutside";

import * as S from '~/styled-components/dashboard/delegation'
import * as P from '~/styled-components/dashboard/profile'
import * as D from '~/styled-components/components/dropdown'
import * as E from '~/styled-components/error'
import { FiMail, FiExternalLink, FiCheck, FiEdit, FiX } from 'react-icons/fi';
import { getDelegationById } from '~/models/delegation.server';
import { EditUserData } from './data';
import Spinner from '~/styled-components/components/spinner';

export const loader = async ({ request }) => {
  const delegationId = await getDelegationId(request)

  if (!delegationId) throw json({ errors: { delegation: "No delegation found" } }, { status: 404 });

  const delegation = await getDelegationById(delegationId)

  return json({ delegation });
}

const ParticipantsPage = ({ participants, handleUserClick }) => {
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
            <S.DelegateContainer key={`delegation-user-${index}`} onClick={() => handleUserClick(item.name)}>
              <S.Delegate key={index} user={item.id === user.id}>
                <S.Name>
                  {item.name}
                  {leader && <S.Item color="red"> Chefe da Delegação </S.Item>}
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

const CreateParticipantPage = ({ }) => {
  return (
    <div>
      <div>
        Title
      </div>

    </div>
  )
}

const DataPage = ({ delegation, isActive, fetcher, changes, setChanges, editUser, setEditUser, userScrollRef }) => {

  const [languages, setLanguages] = useState(editUser?.delegate?.languagesSimulates)
  const [councilPreference, setCouncilPreference] = useState(editUser?.delegate?.councilPreference)
  const [socialMedias, setSocialMedias] = useState(editUser?.delegationAdvisor?.socialMedia)
  const [allowToChangeUser, setAllowToChangeUser] = useState(true)

  useEffect(() => {
    setAllowToChangeUser(changes.filter((change) => change?.userChange).length > 0 ? false : true)
  }, [changes])

  useEffect(() => {
    if (!fetcher.data?.errors && fetcher.data?.id !== undefined) setEditUser(fetcher.data)
  }, [fetcher])

  useEffect(() => {
    setLanguages(editUser?.delegate?.languagesSimulates)
    setCouncilPreference(editUser?.delegate?.councilPreference)
  }, [editUser])

  const handleChange = name => event => {
    setChanges((current) => [...current.filter((change) => change?.target !== name)])

    if (name === 'councilPreference') {
      if (editUser?.delegate?.councilPreference != event.target.value) {
        setChanges(current => [...current, { target: name, change: event.target.value, userChange: true }])
      }
    } else if (name === 'advisorRole') {
      if (editUser?.delegationAdvisor?.advisorRole != event.target.value) {
        setChanges(current => [...current, { target: name, change: event.target.value, userChange: true }])
      }
    } else if (editUser[name] != event.target.value && delegation[name] != event.target.value && delegation.address[name] != event.target.value) {
      setChanges(current => [...current, { target: name, change: event.target.value, userChange: editUser[name] ? true : false }])
    }
  }

  const handleLanguageChange = lng => {
    setChanges((current) => [...current.filter((el) => el?.target !== 'language')])

    if (languages.includes(lng)) {
      setLanguages((current) => [...current.filter((el) => el !== lng)])
    } else {
      setLanguages((current) => [...current, lng])
    }
  }

  useEffect(() => {
    if (
      (!languages?.every(item => editUser?.delegate.languagesSimulates.includes(item)) ||
        !editUser?.delegate.languagesSimulates?.every(item => languages.includes(item))) &&
      languages?.length > 0
    ) {
      setChanges((current) => [...current, { target: 'language', change: languages, userChange: true }])
    }
  }, [languages])

  const handleSocialMediaChange = sm => event => {
    setChanges((current) => [...current.filter((el) => el?.target !== "sm")])
    console.log(socialMedias)

    setSocialMedias((current) => [...current.filter((el) => el.socialMediaName !== sm)])
    if (socialMedias.includes({ socialMediaName: sm, username: event.target.value })) {
      setSocialMedias((current) => [...current, { username: event.target.value, socialMediaName: sm }])
    } else {
      setSocialMedias((current) => [...current, { username: event.target.value, socialMediaName: sm }])
    }
  }

  useEffect(() => {
    if (
      (!socialMedias?.every(item => editUser?.delegationAdvisor.socialMedia.find(el => el.username === item.username)) ||
        !editUser?.delegationAdvisor.socialMedia.every(item => socialMedias.find(el => el.username === item.username))) &&
      socialMedias?.length > 0
    ) {
      setChanges((current) => [...current, { target: 'sm', change: socialMedias, userChange: true }])
    }
  }, [socialMedias])


  const handleCouncilPreference = (result) => {
    if (!result.destination || !isActive) {
      return;
    }

    const newItems = [...councilPreference];
    const [removed] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, removed);

    setChanges((current) => [...current.filter((change) => change?.target !== "councilPreference")])

    if (!newItems.every((item, i) => i === editUser?.delegate.councilPreference.indexOf(item)) && !editUser?.delegate.councilPreference.every((item, i) => i === newItems.indexOf(item))) {
      setChanges(current => [...current, { target: "councilPreference", change: newItems, userChange: true }])
    }

    setCouncilPreference(newItems);
  }

  return (
    <S.DataForm disabled={isActive} method="post" action="/dashboard/data" id='data'>
      <S.DataWrapper>
        <S.UserSelectBox>
          <S.UserSelectTitle>
            Dados da Delegação
          </S.UserSelectTitle>
        </S.UserSelectBox>

        <S.DataContainer>
          {[
            ["School / University", "school", "text"],
            ["Contact Number", "schoolPhoneNumber", "text"],
          ].map((item, index) => (
            <P.ItemContainer key={`item-${item[1]}`}>
              <P.Key err={fetcher?.data?.errors?.[item[1]]}>
                {fetcher?.data?.errors?.[item[1]] ?? item[0]}
              </P.Key>

              <P.Item
                id={item[1]}
                required
                name={item[1]}
                type={item[2]}
                defaultValue={delegation[item[1]]}
                autoComplete="false"
                disabled={!isActive}
                onChange={handleChange(item[1])}
              />
            </P.ItemContainer>
          ))}

          <P.ItemContainer>
            <P.Key err={fetcher?.data?.errors?.participationMethod}>
              {fetcher?.data?.errors?.participationMethod ?? "Metodo de Participação"}
            </P.Key>

            <P.Select
              disabled={!isActive}
              onChange={handleChange('participationMethod')}
              key={delegation.participationMethod}
              defaultValue={delegation.participationMethod}
            >
              {[
                'Online',
                'Presencial',
                'Ambos'
              ].map((item, index) => (
                <P.Option key={`position-${item}`}>{item}</P.Option>
              ))}
            </P.Select>
          </P.ItemContainer>
        </S.DataContainer>

        <S.DataContainer>
          {[
            ["Country", "country", "text"],
            ["CEP", "cep", "text"],
            ["State", "state", "text"],
            ["City", "city", "text"],
            ["Address", "address", "text"],
            ["Neighborhood", "neighborhood", "text"],

          ].map((item, index) => (
            <P.ItemContainer key={`item-${item[1]}`}>
              <P.Key err={fetcher?.data?.errors?.[item[1]]}>
                {fetcher?.data?.errors?.[item[1]] ?? item[0]}
              </P.Key>

              <P.Item
                id={item[1]}
                required
                name={item[1]}
                type={item[2]}
                defaultValue={delegation.address[item[1]]}
                autoComplete="false"
                disabled={!isActive}
                onChange={handleChange(item[1])}
              />
            </P.ItemContainer>
          ))}
        </S.DataContainer>

        <S.UserSelectBox ref={userScrollRef}>
          <S.UserSelectTitle>
            Dados do participante
          </S.UserSelectTitle>

          <S.UserSelect
            onChange={e => {
              const aux = delegation.participants.find(el => el.name === e.target.value)
              setEditUser(aux)
            }}
            disabled={!allowToChangeUser}
            defaultValue={editUser?.name}
          >
            {delegation.participants.map((item, index) => (
              <option
                style={{ whiteSpace: 'pre' }}
                key={`participant-option-${index}`}
                value={item.name}
              >
                {item.name}
              </option>
            ))}
          </S.UserSelect>
        </S.UserSelectBox>

        <S.UserDataContainer>
          <EditUserData
            isActive={isActive}
            actionData={fetcher?.data}
            handleChange={handleChange}
            languages={languages}
            handleLanguageChange={handleLanguageChange}
            councilPreference={councilPreference}
            handleCouncilPreference={handleCouncilPreference}
            handleSocialMediaChange={handleSocialMediaChange}
            data={editUser}
            userType={editUser.delegate ? 'delegate' : 'delegationAdvisor'}
            delegationAdvisor={editUser?.delegationAdvisor}
            delegate={editUser?.delegate}
          />
        </S.UserDataContainer>
      </S.DataWrapper>

      <input type="hidden" name="userId" value={editUser.id} />
      <input type="hidden" name="changes" value={qs.stringify(changes)} />
    </S.DataForm>
  )
}

const slideVariants = {
  enter: (direction) => {
    return {
      x: direction > 0 ? "8%" : "-8%",
      opacity: 0
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction) => {
    return {
      zIndex: 0,
      x: direction < 0 ? "8%" : "-8%",
      opacity: 0
    };
  }
};

const Delegation = () => {

  const { delegation } = useLoaderData()
  const user = useUser()
  const userType = useUserType()

  // selected menu and slide direction
  const [[page, direction], setPage] = useState([0, 0]);
  const paginate = (newDirection, newPage) => {
    setPage([newPage, newDirection]);
  };
  const menuRef = useRef(null)
  const [menuHeight, setMenuHeight] = useState(menuRef.current?.firstChild.offsetHeight)

  // data changes
  const [isActive, setIsActive] = useState(false)
  const [changes, setChanges] = useState([])
  const updateData = useFetcher()
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!user.leader && userType !== 'advisor') return

    if (changes.length > 0) {
      updateData.submit(e.currentTarget, { replace: true })
    } else {
      setIsActive(!isActive)
    }
  }
  useEffect(() => {
    if (updateData.state === 'loading' && !updateData.data?.errors) {
      setIsActive(false)
      setChanges([])
    }
  }, [updateData])

  const [editUser, setEditUser] = useState(delegation.participants[0])


  // invite link
  const [inviteMenuOpen, setInviteMenuOpen] = useState(false)
  const inviteMenuRef = useRef(null)
  useClickOutside(inviteMenuRef, () => setInviteMenuOpen(false))
  const updateInviteLink = useFetcher()
  const handleUpdateInviteLink = async (e) => {
    e.preventDefault();
    updateInviteLink.submit(e.currentTarget, { replace: true })
  }

  //scroll when clicked on user
  const userScrollRef = useRef(null)
  function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  const handleUserClick = async name => {
    setMenu("data")
    setEditUser(delegation.participants.find(el => el.name === name))
    await timeout(1000)
    userScrollRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <S.Wrapper>
      <S.NavContainer style={{ height: menuHeight }}>
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            ref={menuRef}
            key={`${page}-menu`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: .4, ease: "easeInOut" }}
            onAnimationStart={() => { setMenuHeight(menuRef?.current.offsetHeight + (page === 0 ? 25 : 0)) }}
          >
            <S.Nav key='0-menu' active={page === 0}>
              <S.TitleBox>
                <S.SubTitle>
                  Delegação
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
          </motion.div>
        </AnimatePresence>
      </S.NavContainer>

      <S.Menu>
        <S.MenuItem
          active={page === 0}
          onClick={() => {
            paginate(0 > page ? 1 : -1, 0)
            setChanges([]);
            setIsActive(false)
          }}
        >
          Participantes
          {page === 0 ? <S.UnderLine layoutId="paymentPageUnderline" /> : null}
        </S.MenuItem>

        <S.MenuItem
          active={page === 1}
          onClick={() => {
            paginate(1 > page ? 1 : -1, 1)
          }}
        >
          Criar Participante
          {page === 1 ? <S.UnderLine layoutId="paymentPageUnderline" /> : null}
        </S.MenuItem>

        <S.MenuItem
          active={page === 2}
          onClick={() => {
            paginate(2 > page ? 1 : -1, 2)
          }}
        >
          Dados
          {page === 2 ? <S.UnderLine layoutId="paymentPageUnderline" /> : null}
        </S.MenuItem>

        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={`${page}-menu`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: .4, ease: "easeInOut" }}
          >
            {page === 2 &&
              <P.ColorItem
                key='2-menu'
                onClick={handleSubmit}
                color={user.leader || userType === 'advisor' ? !isActive ? 'blue' : changes.length > 0 ? 'green' : 'red' : 'gray'}
                form="data"
              >
                {updateData.state !== 'idle' ? <><Spinner dim={18} color='green' /> Salvando</> : !isActive ? <><FiEdit /> Editar</> : changes.length > 0 ? <><FiCheck /> Salvar Alterações</> : <><FiX /> Cancelar</>}
              </P.ColorItem>
            }
          </motion.div>
        </AnimatePresence>
      </S.Menu >

      <AnimatePresence initial={false} mode="wait" custom={direction}>
        <motion.div
          key={`${page}-menu`}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: .4, ease: "easeInOut" }}
        >
          {page === 0 ?
            <ParticipantsPage
              key="0-menu"
              participants={delegation.participants}
              handleUserClick={handleUserClick}
            /> : page === 1 ?
              <CreateParticipantPage 
                key="1-menu"
              /> :
              <DataPage
                key="2-menu"
                isActive={isActive}
                delegation={delegation}
                fetcher={updateData}
                changes={changes}
                setChanges={setChanges}
                editUser={editUser}
                setEditUser={setEditUser}
                userScrollRef={userScrollRef}
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

  if (caught.data.errors.delegation === "No delegation found") {
    return (
      <S.Wrapper>
        <S.Title>
          Delegação
        </S.Title>

        <E.Message style={{ marginTop: '25px' }}>
          Parece que você ainda nao entrou para uma delegação

          <E.GoBacklink to={`/join/delegation?${new URLSearchParams([["redirectTo", safeRedirect(matches[1].pathname)]])}`}>
            Entrar em uma delegação
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
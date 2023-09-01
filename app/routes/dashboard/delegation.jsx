import { useState, useRef, useEffect } from 'react';
import { json, redirect } from '@remix-run/node';
import { useMatches, useCatch, useLoaderData, useFetcher, useActionData, useTransition, useSubmit, Outlet, NavLink } from '@remix-run/react';
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import qs from 'qs'
import _, { set } from 'lodash';

import { getDelegationId } from '~/session.server';
import { useUser, safeRedirect, useUserType, formatDate } from '~/utils';
import { getDelegationById } from '~/models/delegation.server';
import { useClickOutside } from "~/hooks/useClickOutside";
import { useWrapChange } from '~/hooks/useWrapChange';
import { useOnScreen } from '~/hooks/useOnScreen';

import * as S from '~/styled-components/dashboard/delegation'
import * as P from '~/styled-components/dashboard/data'
import * as D from '~/styled-components/components/dropdown/elements'
import * as E from '~/styled-components/error'
import Spinner from '~/styled-components/components/spinner';
import { FiMail, FiExternalLink, FiCheck, FiEdit, FiX, FiUserPlus } from 'react-icons/fi';
import EditUserData from '~/styled-components/components/dataBox/user';
import DefaultDropdown from '~/styled-components/components/dropdown';
import EditDelegationData from '~/styled-components/components/dataBox/delegation';
import PopoverTrigger from '~/styled-components/components/popover/popoverTrigger';
import Dialog from '~/styled-components/components/dialog';
import ColorButtonBox from '~/styled-components/components/buttonBox/withColor';
import Button from '~/styled-components/components/button';

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  if (url.pathname === "/dashboard/delegation") return redirect("/dashboard/delegation/participants")

  const delegationId = await getDelegationId(request)

  if (!delegationId) throw json({ errors: { delegation: "No delegation found" } }, { status: 404 });

  const delegation = await getDelegationById(delegationId)

  return json({ delegation });
}

const ParticipantsPage = ({ user, participants, handleUserClick }) => {
  return (
    <S.OverflowContainer>
      <S.DelegatesTable>
        <thead>
          <S.TableRow example>
            <S.TableCell>
              Nome
            </S.TableCell>

            <S.TableCell style={{ paddingLeft: "30px" }}>
              Posição
            </S.TableCell>

            <S.TableCell>
              Entrou em
            </S.TableCell>
          </S.TableRow>
        </thead>

        <tbody>
          {participants.map((item, index) => {
            const leader = item.leader
            return (
              <S.TableRow key={`delegation-user-${index}`} onClick={() => handleUserClick(item.id)}>
                <S.TableCell user={item.id === user.id}>
                  <S.CellFlexBox>
                    {item.name}
                    {leader && <S.Item color="red"> Chefe da Delegação </S.Item>}
                  </S.CellFlexBox>
                </S.TableCell>

                <S.TableCell>
                  <S.CellFlexBox>
                    <S.Item color={item.delegate ? 'blue' : 'green'}>
                      {item.delegate ? "Delegado" : item.delegationAdvisor.advisorRole}
                    </S.Item>
                  </S.CellFlexBox>
                </S.TableCell>

                <S.TableCell>
                  {formatDate(item.createdAt.split("T")[0])}
                </S.TableCell>
              </S.TableRow>
            )
          })}
        </tbody>
      </S.DelegatesTable>
    </S.OverflowContainer>
  )
}

const CreateParticipantPage = ({ user, userType, delegatesCount, delegationId }) => {

  // used for showing alternate button when the first one isn't visible
  const [buttonRef, isRefVisible] = useOnScreen();

  const [creatingUserType, setCreatingUserType] = useState("delegate")
  const shouldBeAbleToCreate = userType === "advisor" ? true : user.leader ?? false
  const [allowCreation, setAllowCreation] = useState(false)

  useEffect(() => {
    setAllowCreation(() => {
      if (creatingUserType === "delegate" && delegatesCount > 10) return false
      if (userType === "advisor" || user.leader) return true
    })
  }, [creatingUserType])

  const changeCreatingUserType = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    setCreatingUserType(prevState => prevState === "delegate" ? "delegationAdvisor" : "delegate")
  }

  const fetcher = useFetcher()

  // handle create user submission
  const handleSubmission = (e) => {
    e.preventDefault()
    fetcher.submit(e.currentTarget, { replace: true })
  }

  // state to verify type of user being created

  // normal user for parameter
  const normalUser = {
    email: '',
    name: '',
    document: { documentName: 'cpf', value: '' },
    phoneNumber: '',
    birthDate: '',
    nacionality: 'Brazil',
    delegate: {
      emergencyContactName: '',
      emergencyContactPhoneNumber: '',
      councilPreference: [
        'Conselho_de_Seguranca_da_ONU',
        'Rio_92',
        'Assembleia_Geral_da_ONU',
        'Conselho_de_Juventude_da_ONU'
      ],
      languagesSimulates: []
    },
    delegationAdvisor: {
      advisorRole: 'Professor',
      Facebook: '',
      Instagram: '',
      Linkedin: ''
    }
  }

  // data being changed
  const [formData, setFormData] = useState(normalUser)

  // change the data based on the user type
  useEffect(() => {
    setFormData((prevState) => {
      let newData = { ...prevState }

      if (creatingUserType === "delegate") {
        newData.delegationAdvisor = null
        newData.delegate = normalUser.delegate
      } else {
        newData.delegate = null
        newData.delegationAdvisor = normalUser.delegationAdvisor
      }

      return newData
    })
  }, [creatingUserType])

  // if user created set the input values back to empty
  useEffect(() => {
    if (fetcher?.data?.name === formData.name) setFormData(normalUser)
  }, [fetcher])

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevState) => {
      // Copy the existing state
      let newData = { ...prevState };

      // Check if the name includes a '.'
      if (name.includes('.')) {
        const [field, nestedField] = name.split('.');

        // Check if the data object has the field and if the field is an object
        if (newData[field] && typeof newData[field] === 'object') {
          newData[field][nestedField] = value;
        } else {
          newData[field] = { [nestedField]: value };
        }
      } else {
        newData[name] = value;
      }

      if (name === "nacionality") {
        newData.document.documentName = value === "Brazil" ? "cpf" : "passport"
        newData.document.value = ""
      }

      // Return the updated state
      return newData;
    });
  };

  const handleAddLanguage = (event) => {
    const newLanguage = event.target.value;
    if (!formData.delegate.languagesSimulates.includes(newLanguage)) {
      setFormData({
        ...formData,
        delegate: {
          ...formData.delegate,
          languagesSimulates: [...formData.delegate.languagesSimulates, newLanguage],
        },
      });
    }
  };

  const handleRemoveLanguage = (language) => {
    setFormData({
      ...formData,
      delegate: {
        ...formData.delegate,
        languagesSimulates: formData.delegate.languagesSimulates.filter(lang => lang !== language),
      },
    });
  };

  return (
    <S.DataForm disabled={!allowCreation} method="post" action="/api/manualUserCreate">
      <S.DataTitleBox>
        <S.DataTitle>
          {shouldBeAbleToCreate ?
            <P.ColorItem
              onClick={handleSubmission}
              color={fetcher.state !== 'idle' ? "blue" : allowCreation ? "green" : "gray"}
              disabled={!allowCreation}
              ref={buttonRef}
            >
              {fetcher.state !== 'idle' ?
                <><Spinner dim={18} color='green' /> Adicionando</> :
                <><FiUserPlus /> Adicionar Participante</>}
            </P.ColorItem> :
            "Somente o líder da delegação e os orientadores podem adicionar participantes manualmente"
          }
        </S.DataTitle>
      </S.DataTitleBox>

      <S.DataTitleBox
        style={{
          pointerEvents: allowCreation ? 'auto' : 'none',
          opacity: allowCreation ? 1 : 0.5,
        }}
      >
        <S.DataSubTitle>
          Tipo do participante
        </S.DataSubTitle>

        <S.UserSelect
          onChange={changeCreatingUserType}
          disabled={!allowCreation}
        >
          {["delegate", "delegationAdvisor"].map((type, index) => (
            <option
              style={{ whiteSpace: 'pre' }}
              key={type}
              value={type}
            >
              {type === "delegate" ? "Delegado" : "Professor(a) Orientador(a)"}
            </option>
          ))}
        </S.UserSelect>

        {creatingUserType === "delegate" && allowCreation ?
          <S.DelegateCountdown>
            <P.ColorItem color="red" disabled>
              {10 - delegatesCount} vagas restantes para delegados
            </P.ColorItem>
          </S.DelegateCountdown> :
          null
        }
      </S.DataTitleBox>

      <EditUserData
        isDisabled={!allowCreation}
        actionData={fetcher.data}
        formData={formData}
        handleChange={handleChange}
        handleAddLanguage={handleAddLanguage}
        handleRemoveLanguage={handleRemoveLanguage}
        userType={creatingUserType}
      />

      {allowCreation ? <AnimatePresence>
        {!isRefVisible && (
          <S.StickyButton
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <P.ColorItem
              onClick={handleSubmission}
              boxShadow
              color={fetcher.state !== 'idle' ? "blue" : allowCreation ? "green" : "gray"}
              disabled={!allowCreation}
            >
              {fetcher.state !== 'idle' ?
                <><Spinner dim={18} color='green' /> Adicionando</> :
                <><FiUserPlus /> Adicionar Participante</>}
            </P.ColorItem>
          </S.StickyButton>
        )}
      </AnimatePresence> : null}

      <input type="hidden" name="data" value={qs.stringify(formData)} />
      <input type="hidden" name="delegationId" value={delegationId} />

    </S.DataForm >
  )
}

const DataPage = ({
  user,
  userType,
  delegation,
  userScrollRef,
  clickedUserFromTableId
}) => {

  // used for showing alternate button when the first one isnt visible
  const [buttonRef, isRefVisible] = useOnScreen();

  // data changes
  const fetcher = useFetcher()
  // only allow changes to advisor or delegation leader
  const allowChanges = userType === "advisor" ? true : user.leader ?? false
  // ready submission if changes have been made, and data change active if user clicked on the button to edit the data
  const [readySubmission, setReadySubmission] = useState(false)
  const [userWantsToChangeData, setUserWantsToChangeData] = useState(false)
  // only one user change at a time, this state controls if you can change the user being edited
  const [allowChangeParticipant, setAllowChangeParticipant] = useState(true)

  // delegation data is the copy of the delegation ready for being changed without altering the original data
  // have to use cloneDeep here for later lodash functions uses later
  const [formData, setFormData] = useState(_.cloneDeep(delegation));
  // current user being visualized
  const [selectedUserId, setSelectedUserId] = useState(
    clickedUserFromTableId ?? formData.participants[0].id
  );

  // useEffect for every data change
  useEffect(() => {
    // if data is different from orginal data and the user clicked on the edit data button (userWantsToChangeData),
    // allow form submission and lock the user being edited, else don't
    if (!_.isEqual(delegation, formData) && userWantsToChangeData) {
      //different data
      setReadySubmission(true)
      setAllowChangeParticipant(false)
    } else {
      setReadySubmission(false)
      setAllowChangeParticipant(true)
    }
  }, [formData])

  // useEffect for successful submission of data change form
  useEffect(() => {
    if (fetcher.state === 'loading' && !fetcher.data?.errors) {
      // set the delegation data for the updated one recieved from the server
      setFormData(_.cloneDeep(fetcher.data))
      // set these variables to original state
      setReadySubmission(false)
      setUserWantsToChangeData(false)
      setAllowChangeParticipant(true)
      fetcher.data = undefined
    }
  }, [fetcher])

  const handleSubmission = (e) => {
    e.preventDefault()
    if (!allowChanges) return

    // if submission is ready, meaning that the data has been modified, submi the form, else it means that the user wants to edit the data
    if (readySubmission) {
      fetcher.submit(e.currentTarget, { replace: true })
    } else {
      setUserWantsToChangeData(!userWantsToChangeData)
    }
  }

  const handleDelegationChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevState) => {
      let newData = { ...prevState };

      if (name.includes('.')) {
        const [field, nestedField] = name.split('.');

        // Check if the user object has the field and if the field is an object
        if (newData[field] && typeof newData[field] === 'object') {
          newData[field][nestedField] = value;
        } else {
          newData[field] = { [nestedField]: value };
        }
      } else {
        newData[name] = value;
      }

      return newData
    })
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevState) => {
      // Copy the existing state
      let newData = { ...prevState };

      // Find the user and update the field
      const user = newData.participants.find(
        (participant) => participant.id === selectedUserId
      );
      if (user) {
        // Check if the name includes a '.'
        if (name.includes('.')) {
          const [field, nestedField] = name.split('.');

          // Check if the user object has the field and if the field is an object
          if (user[field] && typeof user[field] === 'object') {
            user[field][nestedField] = value;
          } else {
            user[field] = { [nestedField]: value };
          }
        } else {
          user[name] = value;
        }
      }

      if (name === "nacionality") {
        user.document.documentName = value === "Brazil" ? "cpf" : "passport"
        user.document.value = ""
      }

      // Return the updated state
      return newData;
    });
  };

  const handleAddLanguage = (event) => {
    const newLanguage = event.target.value;

    setFormData((prevState) => {
      let newData = { ...prevState };

      const user = newData.participants.find(
        (participant) => participant.id === selectedUserId
      );
      if (user && !user.delegate.languagesSimulates.includes(newLanguage)) {
        user.delegate.languagesSimulates.push(newLanguage);
      }

      return newData;
    });
  };

  const handleRemoveLanguage = (language) => {
    setFormData((prevState) => {
      let newData = { ...prevState };

      // Find the user and remove the language from the language array
      const user = newData.participants.find(
        (participant) => participant.id === selectedUserId
      );
      if (user) {
        user.delegate.languagesSimulates = user.delegate.languagesSimulates.filter(
          (el) => el !== language
        );
      }

      return newData;
    });
  };

  return (
    <S.DataForm method="post" action="/dashboard/data">
      <S.DataTitleBox ref={buttonRef}>
        <P.ColorItem
          key='2-menu'
          onClick={handleSubmission}
          color={
            allowChanges ?
              userWantsToChangeData ?
                readySubmission ?
                  'green' :
                  'red' :
                'blue' :
              'gray'
          }
        >
          {fetcher.state !== 'idle' ?
            <><Spinner dim={18} color='green' /> Salvando</> :
            !userWantsToChangeData ?
              <><FiEdit /> Editar Dados</> :
              readySubmission ?
                <><FiCheck /> Salvar Alterações</> :
                <><FiX /> Cancelar</>}
        </P.ColorItem>
      </S.DataTitleBox>

      <EditDelegationData
        isDisabled={!userWantsToChangeData}
        formData={formData}
        actionData={fetcher.data}
        handleChange={handleDelegationChange}
      />

      <S.DataTitleBox ref={userScrollRef}>
        <S.DataSubTitle>
          Dados do participante
        </S.DataSubTitle>

        <S.UserSelect
          onChange={event => setSelectedUserId(event.target.value)}
          disabled={!allowChangeParticipant}
          value={selectedUserId}
        >
          {formData.participants.map((user, index) => (
            <option
              style={{ whiteSpace: 'pre' }}
              key={user.id}
              value={user.id}
            >
              {user.name}
            </option>
          ))}
        </S.UserSelect>
      </S.DataTitleBox>

      <EditUserData
        isDisabled={!userWantsToChangeData}
        actionData={fetcher.data}
        formData={formData.participants.find((participant) => participant.id === selectedUserId)}
        handleChange={handleChange}
        handleAddLanguage={handleAddLanguage}
        handleRemoveLanguage={handleRemoveLanguage}
        userType={formData.participants.find((participant) => participant.id === selectedUserId).delegate ? 'delegate' : 'delegationAdvisor'}
      />

      <AnimatePresence>
        {!isRefVisible && (
          <S.StickyButton
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <P.ColorItem
              key='2-menu'
              onClick={handleSubmission}
              boxShadow={true}
              color={
                allowChanges ?
                  userWantsToChangeData ?
                    readySubmission ?
                      'green' :
                      'red' :
                    'blue' :
                  'gray'
              }
            >
              {fetcher.state !== 'idle' ?
                <><Spinner dim={18} color='green' /> Salvando</> :
                !userWantsToChangeData ?
                  <><FiEdit /> Editar Dados</> :
                  readySubmission ?
                    <><FiCheck /> Salvar Alterações</> :
                    <><FiX /> Cancelar</>}
            </P.ColorItem>
          </S.StickyButton>
        )}
      </AnimatePresence>

      <input type="hidden" name="userId" value={selectedUserId} />
      <input type="hidden" name="data" value={qs.stringify(formData)} />
    </S.DataForm >
  )
}

const Delegation = () => {

  const { delegation } = useLoaderData()
  const stickyRef = useRef(null);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const { top } = stickyRef.current.getBoundingClientRect();
      setIsSticky(top <= 45);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // invite menu
  const [inviteMenuOpen, setInviteMenuOpen] = useState(false)
  const inviteMenuRef = useRef(null)

  // use this hook to detect outside of the menu click, if the user click outside close the menu
  useClickOutside(inviteMenuRef, () => setInviteMenuOpen(false))
  const updateInviteLink = useFetcher()
  // update invite link submission
  const handleUpdateInviteLink = async (e) => {
    e.preventDefault();
    updateInviteLink.submit(
      { delegationCode: delegation.code },
      { method: "post", action: "/api/updateInviteLink" }
    );
  }

  return (
    <S.Wrapper>
      <S.Nav>
        <S.TilteContainer>
          <S.SubTitle>
            Delegação
          </S.SubTitle>

          <S.Title>
            {delegation.school}
          </S.Title>
        </S.TilteContainer>

        <S.PopoverContainer>
          <PopoverTrigger label={<><FiMail /> Convidar</>}>
            <Dialog>
              <S.DialogTitle>
                Compartilhe o link abaixo
              </S.DialogTitle>

              <ColorButtonBox theme='light' color='red'>
                <Button>
                  Gerar novo link
                </Button>
              </ColorButtonBox>

              <S.DialogTitle>
                Ou utilize este código na inscrição
              </S.DialogTitle>

              <S.DialogItem>
                {delegation.code}
              </S.DialogItem>
            </Dialog>
          </PopoverTrigger>
        </S.PopoverContainer>

        {/* <S.NavButton ref={inviteMenuRef}>
          <S.NavButtonTitle onClick={() => setInviteMenuOpen(!inviteMenuOpen)}>
            <FiMail /> Convidar
          </S.NavButtonTitle>

          <DefaultDropdown open={inviteMenuOpen}>
            <D.CopyToClipBoardLabel text="Compartilhe o link abaixo" icon={<FiExternalLink />} value={delegation.inviteLink} />

            <D.ColorItem color={updateInviteLink.data ? 'green' : 'blue'} type="submit" onClick={handleUpdateInviteLink} disabled={updateInviteLink.state !== "idle"}>
              {updateInviteLink.state === "idle" ? 'Gerar novo link' : 'Alterando'} {updateInviteLink.data && <FiCheck />}
            </D.ColorItem>

            <D.Title>
              Ou utilize este código na inscrição
            </D.Title>

            <D.BiggerItem>
              {delegation.code}
            </D.BiggerItem>
          </DefaultDropdown>
        </S.NavButton> */}
      </S.Nav>

      <S.Menu ref={stickyRef} isSticky={isSticky}>
        {[
          { to: "participants", title: "Participantes" },
          { to: "createUser", title: "Criar Participante" },
          { to: "data", title: "Dados" }
        ].map((item, i) => (
          <S.MenuItem key={i}>
            <NavLink
              tabIndex="0"
              role="link"
              prefetch='render'
              aria-label={`${item.title}-page`}
              to={item.to}
            >
              {({ isActive }) => (
                <> {item.title} {isActive ? <S.UnderLine layoutId="paymentPageUnderline" /> : null} </>
              )}
            </NavLink>
          </S.MenuItem>
        ))}
      </S.Menu>

      <Outlet context={delegation} />
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
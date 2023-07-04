import { useState, useRef, useEffect } from 'react';
import { json } from '@remix-run/node';
import { useMatches, useCatch, useLoaderData, useFetcher, useActionData, useTransition, useSubmit } from '@remix-run/react';
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import qs from 'qs'
import _ from 'lodash';

import { getDelegationId } from '~/session.server';
import { useUser, safeRedirect, useUserType } from '~/utils';
import { useClickOutside } from "~/hooks/useClickOutside";

import * as S from '~/styled-components/dashboard/delegation'
import * as P from '~/styled-components/dashboard/data'
import * as D from '~/styled-components/components/dropdown'
import * as E from '~/styled-components/error'
import { FiMail, FiExternalLink, FiCheck, FiEdit, FiX, FiUserPlus } from 'react-icons/fi';
import { getDelegationById } from '~/models/delegation.server';
import { EditUserData } from './data';
import Spinner from '~/styled-components/components/spinner';

export const loader = async ({ request }) => {
  const delegationId = await getDelegationId(request)

  if (!delegationId) throw json({ errors: { delegation: "No delegation found" } }, { status: 404 });

  const delegation = await getDelegationById(delegationId)

  return json({ delegation });
}

const ParticipantsPage = ({ user, participants, handleUserClick }) => {
  return (
    <S.OverflowContainer>
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

        {participants.map((item, index) => {
          const leader = item.leader
          return (
            <S.DelegateContainer key={`delegation-user-${index}`} onClick={() => handleUserClick(item.id)}>
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
      </S.DelegatesListWrapper>
    </S.OverflowContainer>
  )
}

const CreateParticipantPage = ({ user, userType, delegatesCount, delegationId }) => {

  const allowChanges = userType === "advisor" ? true : user.leader ?? false
  const fetcher = useFetcher()

  // handle create user submission
  const handleSubmission = (e) => {
    e.preventDefault()
    fetcher.submit(e.currentTarget, { replace: true })
  }

  // state to verify type of user being created
  const [isDelegate, setIsDelegate] = useState(true)

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

      if (isDelegate) {
        newData.delegationAdvisor = null
        newData.delegate = normalUser.delegate
      } else {
        newData.delegate = null
        newData.delegationAdvisor = normalUser.delegationAdvisor
      }

      return newData
    })
  }, [isDelegate])

  useEffect(() => {
    if (fetcher?.data?.name === formData.name) setFormData(normalUser)
  }, [fetcher])

  const changeUserType = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // You can change it to 'auto' for instant scrolling
    });
    setIsDelegate(!isDelegate)
  }

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

  const handleCouncilPreference = (result) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(formData.delegate.councilPreference);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setFormData(prevState => ({
      ...prevState,
      delegate: {
        ...prevState.delegate,
        councilPreference: items,
      }
    }));
  }

  return (
    <S.DataForm disabled={!allowChanges} method="post" action="/api/manualUserCreate">
      <S.DataTitleBox>
        <S.DataTitle>
          {allowChanges ?
            "Adicionar participante manualmente" :
            "Somente o líder da delegação e os orientadores podem adicionar participantes manualmente"}
        </S.DataTitle>
      </S.DataTitleBox>

      <S.DisabledMask show={!allowChanges}>
        <S.DataTitleBox>
          <S.DataSubTitle>
            Tipo do participante
          </S.DataSubTitle>

          <S.UserSelect
            onChange={changeUserType}
            disabled={!allowChanges}
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

          {isDelegate && allowChanges ?
            <S.DataTitle>
              <P.ColorItem color="red" disabled>
                {10 - delegatesCount} vagas restantes para delegados
              </P.ColorItem>
            </S.DataTitle> :
            null
          }
        </S.DataTitleBox>

        <EditUserData
          allowChanges={allowChanges}
          actionData={fetcher.data}
          formData={formData}
          handleChange={handleChange}
          handleAddLanguage={handleAddLanguage}
          handleRemoveLanguage={handleRemoveLanguage}
          handleCouncilPreference={handleCouncilPreference}
          userType={isDelegate ? "delegate" : "delegationAdvisor"}
        />

        <S.DataTitleBox>
          <S.DataTitle>
            <P.ColorItem color="green" onClick={handleSubmission}>
              <FiUserPlus /> Adicionar Usuário
            </P.ColorItem>
          </S.DataTitle>
        </S.DataTitleBox>
      </S.DisabledMask>

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

  const containerRef = useRef(null);
  const isWrapped = useWrapChange(containerRef);

  // data changes
  const dataChangeFecther = useFetcher()
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

  useEffect(() => {
    console.log(formData)
  }, [])

  // useEffect for successful submission of data change form
  useEffect(() => {
    if (dataChangeFecther.state === 'loading' && !dataChangeFecther.data?.errors) {
      // set the delegation data for the updated one recieved from the server
      setFormData(_.cloneDeep(dataChangeFecther.data))
      // set these variables to original state
      setReadySubmission(false)
      setUserWantsToChangeData(false)
      setAllowChangeParticipant(true)
      dataChangeFecther.data = undefined
    }
  }, [dataChangeFecther])

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

  const handleSubmission = (e) => {
    e.preventDefault()
    if (!allowChanges) return

    // if submission is ready, meaning that the data has been modified, submi the form, else it means that the user wants to edit the data
    if (readySubmission) {
      dataChangeFecther.submit(e.currentTarget, { replace: true })
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
      if (user) {
        user.delegate.languagesSimulates.push(newLanguage);
      }

      return newData;
    });
  };

  const handleRemoveLanguage = (languageToRemove) => {
    setFormData((prevState) => {
      let newData = { ...prevState };

      // Find the user and remove the language from the language array
      const user = newData.participants.find(
        (participant) => participant.id === selectedUserId
      );
      if (user) {
        user.delegate.languagesSimulates = user.delegate.languagesSimulates.filter(
          (language) => language !== languageToRemove
        );
      }

      return newData;
    });
  };

  const handleCouncilPreference = (result) => {
    if (!result.destination) {
      return;
    }

    setFormData((prevState) => {
      let newData = { ...prevState };

      const user = newData.participants.find(
        (participant) => participant.id === selectedUserId
      );
      if (user && user.delegate) {
        const reorderedCouncilPreferences = Array.from(user.delegate.councilPreference);
        const [removed] = reorderedCouncilPreferences.splice(result.source.index, 1);
        reorderedCouncilPreferences.splice(result.destination.index, 0, removed);

        user.delegate.councilPreference = reorderedCouncilPreferences;
      }

      return newData;
    });
  }

  return (
    <S.DataForm disabled={false} method="post" action="/dashboard/data" id='data'>
      <S.DataTitleBox>
        {/* <S.DataTitle>
          Editar dados da delegação e de seus participantes
        </S.DataTitle> */}

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
          form="data"
        >
          {dataChangeFecther.state !== 'idle' ?
            <><Spinner dim={18} color='green' /> Salvando</> :
            !userWantsToChangeData ?
              <><FiEdit /> Editar Dados</> :
              readySubmission ?
                <><FiCheck /> Salvar Alterações</> :
                <><FiX /> Cancelar</>}
        </P.ColorItem>
      </S.DataTitleBox>

      <P.Wrapper ref={containerRef} isWrapped={isWrapped}>
        <P.Column>
          <P.Container key="delegation-address-container">
            <P.ContainerTitle>
              Endereço da Escola / Universidade
            </P.ContainerTitle>

            <P.InputContainer>
              {[
                ["Country", "address.country", "text"],
                ["CEP", "address.postalCode", "text"],
                ["State", "address.state", "text"],
                ["City", "address.city", "text"],
                ["Address", "address.address", "text"],
                ["Neighborhood", "address.neighborhood", "text"],

              ].map((item, index) => (
                <React.Fragment key={`${index}-address-input`}>
                  <P.Label err={dataChangeFecther.data?.errors?.[item[1]]}>
                    {dataChangeFecther.data?.errors?.[item[1]] ?? item[0]}
                  </P.Label>

                  <P.Input
                    id={item[1]}
                    required
                    name={item[1]}
                    type={item[2]}
                    defaultValue={formData.address[item[1].split('.')[1]]}
                    autoComplete="false"
                    disabled={!userWantsToChangeData}
                    onChange={handleDelegationChange}
                  />
                </React.Fragment>
              ))}
            </P.InputContainer>
          </P.Container>
        </P.Column>

        <P.Column>
          <P.Container key="delegation-data-container">
            <P.ContainerTitle border="red">
              Dados da Delegação
            </P.ContainerTitle>

            <P.InputContainer>

              <P.Label err={dataChangeFecther.data?.errors?.school} key="label-schoolName">
                {dataChangeFecther.data?.errors?.school ?? "School / University"}
              </P.Label>

              <P.Input
                id="school"
                required
                name="school"
                type="text"
                value={formData?.school}
                autoComplete="false"
                disabled={!userWantsToChangeData}
                onChange={handleDelegationChange}
              />

              <P.Label err={dataChangeFecther.data?.errors?.schoolPhoneNumber} key="label-schoolPhoneNumber">
                {dataChangeFecther.data?.errors?.schoolPhoneNumber ?? "Contact Number"}
              </P.Label>

              <P.PhoneNumberInput
                id="schoolPhoneNumber"
                required
                name="schoolPhoneNumber"
                type='text'
                value={formData?.schoolPhoneNumber}
                onChange={value => handleDelegationChange({ target: { name: "schoolPhoneNumber", value: value } })}
                disabled={!userWantsToChangeData}
                autoComplete="false"
                err={dataChangeFecther.data?.errors?.schoolPhoneNumber}
              />

              <P.Label err={dataChangeFecther.data?.errors?.participationMethod}>
                {dataChangeFecther.data?.errors?.participationMethod ?? "Participação"}
              </P.Label>

              <P.Select
                disabled={!userWantsToChangeData}
                name="participationMethod"
                onChange={handleDelegationChange}
                key={formData.participationMethod}
                defaultValue={formData.participationMethod}
              >
                {[
                  'Online',
                  'Presencial',
                  'Ambos'
                ].map((item, index) => (
                  <option key={`position-${item}`}>{item}</option>
                ))}
              </P.Select>
            </P.InputContainer>
          </P.Container>
        </P.Column>
      </P.Wrapper>

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
        allowChanges={userWantsToChangeData}
        actionData={dataChangeFecther.data}
        formData={formData.participants.find((participant) => participant.id === selectedUserId)}
        handleChange={handleChange}
        handleAddLanguage={handleAddLanguage}
        handleRemoveLanguage={handleRemoveLanguage}
        handleCouncilPreference={handleCouncilPreference}
        userType={formData.participants.find((participant) => participant.id === selectedUserId).delegate ? 'delegate' : 'delegationAdvisor'}
      />

      <input type="hidden" name="userId" value={selectedUserId} />
      <input type="hidden" name="data" value={qs.stringify(formData)} />
    </S.DataForm >
  )
}

const useWrapChange = (ref) => {
  const [isWrapped, setIsWrapped] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (!ref.current) return;
      const children = ref.current.children;
      if (children.length < 2) return;
      setIsWrapped(children[0].offsetTop !== children[1].offsetTop);
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // check on mount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [ref]);

  return isWrapped;
};

const Delegation = () => {

  const { delegation } = useLoaderData()

  const user = useUser()
  const userType = useUserType()

  // selected menu
  // slide variants are the framer motion states of the pages for animation
  const slideVariants = {
    enter: (direction) => {
      return {
        height: 0,
        //x: direction > 0 ? "8%" : "-8%",
        opacity: 0
      };
    },
    center: {
      //x: 0,
      height: "auto",
      opacity: 1
    },
    exit: (direction) => {
      return {
        //x: direction < 0 ? "8%" : "-8%",
        height: 0,
        opacity: 0
      };
    }
  };
  const [page, setPage] = useState(2);
  const paginate = (newPage) => {
    // awlays scroll to the top on page change because of animation glitches
    new Promise((resolve) => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });

      const checkScrollComplete = () => {
        if (
          window.pageYOffset === 0 ||
          document.documentElement.scrollTop === 0
        ) {
          resolve(); // Resolves the promise when scrolling completes
        } else {
          requestAnimationFrame(checkScrollComplete);
        }
      };

      checkScrollComplete();
    }).then(() => {
      // set page
      setPage(newPage);
    })
  };
  // used for aditional style when menu is in sticky state in mobile
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
    updateInviteLink.submit(e.currentTarget, { replace: true })
  }

  // when clicking on a user row in the users table, the selected menu has to be the data page 
  // and the window must scroll down for the user section
  const [clickedUserFromTableId, setClickedUserFromTableId] = useState(undefined)
  const userScrollRef = useRef(null)
  function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  const handleUserClick = async id => {
    // got to page
    paginate(2)
    // change user for the clicked one
    setClickedUserFromTableId(id)
    // wait page animation load
    await timeout(1000)
    // scroll into view
    userScrollRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <S.Wrapper>
      <S.Nav>
        <S.DelegationTitle>
          <S.SubTitle>
            Delegação
          </S.SubTitle>

          <S.Title>
            {delegation.school}
          </S.Title>
        </S.DelegationTitle>

        <S.NavButton ref={inviteMenuRef}>
          <S.NavButtonTitle onClick={() => setInviteMenuOpen(!inviteMenuOpen)}>
            <FiMail />

            Convidar
          </S.NavButtonTitle>


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
        </S.NavButton>
      </S.Nav>

      <S.Menu ref={stickyRef} isSticky={isSticky}>
        <S.MenuItem
          active={page === 0}
          onClick={() => {
            paginate(0)
          }}
        >
          Participantes
          {page === 0 ? <S.UnderLine layoutId="paymentPageUnderline" /> : null}
        </S.MenuItem>

        <S.MenuItem
          active={page === 1}
          onClick={() => {
            paginate(1)
          }}
        >
          Criar Participante
          {page === 1 ? <S.UnderLine layoutId="paymentPageUnderline" /> : null}
        </S.MenuItem>

        <S.MenuItem
          active={page === 2}
          onClick={() => {
            paginate(2)
          }}
        >
          Dados
          {page === 2 ? <S.UnderLine layoutId="paymentPageUnderline" /> : null}
        </S.MenuItem>

        {/* <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={`${page}-menu`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: .4, ease: "easeInOut" }}
          >
            {page === 2 &&
              <S.MenuItem active colorItem>
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
                  form="data"
                >
                  {dataChangeFecther.state !== 'idle' ?
                    <><Spinner dim={18} color='green' /> Salvando</> :
                    !userWantsToChangeData ?
                      <><FiEdit /> Editar</> :
                      readySubmission ?
                        <><FiCheck /> Salvar Alterações</> :
                        <><FiX /> Cancelar</>}
                </P.ColorItem>
              </S.MenuItem>
            }
          </motion.div>
        </AnimatePresence> */}
      </S.Menu >

      <AnimatePresence initial={false} mode="wait">
        {page === 0 ?
          <S.Container
            key="0-menu"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: .4, ease: "easeInOut" }}
          >
            <ParticipantsPage
              key="0-menu"
              user={user}
              participants={delegation.participants}
              handleUserClick={handleUserClick}
              delegationId={delegation.id}
            />
          </S.Container>
          : page === 1 ?
            <S.Container
              key="1-menu"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: .4, ease: "easeInOut" }}
            >
              <CreateParticipantPage
                key="1-menu"
                user={user}
                userType={userType}
                delegatesCount={delegation.participants.filter(user => user.delegate !== null).length}
                delegationId={delegation.id}
              />
            </S.Container>
            :
            <S.Container
              key="2-menu"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: .4, ease: "easeInOut" }}
            >
              <DataPage
                key="2-menu"
                user={user}
                userType={userType}
                delegation={delegation}
                userScrollRef={userScrollRef}
                clickedUserFromTableId={clickedUserFromTableId}
              />
            </S.Container>
        }
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
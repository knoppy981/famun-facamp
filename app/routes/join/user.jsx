import { useState, useEffect, useRef } from 'react'
import { useActionData, useLoaderData, useSearchParams } from '@remix-run/react'
import { json, redirect } from '@remix-run/node'
import qs from 'qs'

import { sessionStorage, getSession, createUserSession, getUserId, logout } from "~/session.server";
import { validateEmail, checkString, validatePhoneNumber, safeRedirect } from "~/utils";
import { createUser, getExistingUser } from '~/models/user.server';

import * as S from '~/styled-components/join/user'
import AuthInputBox from '~/styled-components/components/inputs/authInput'
import { FiTrash2, FiAlertTriangle } from 'react-icons/fi'

import br from '~/images/flag-icons/br.svg'
import de from '~/images/flag-icons/de.svg'
import es from '~/images/flag-icons/es.svg'
import fr from '~/images/flag-icons/fr.svg'
import mx from '~/images/flag-icons/mx.svg'
import pt from '~/images/flag-icons/pt.svg'
import us from '~/images/flag-icons/us.svg'

export const action = async ({ request }) => {
  const text = await request.text()
  const session = await getSession(request)
  const { redirectTo, step, action, userType, ...data } = qs.parse(text)
  const searchParams = redirectTo === "" ? "" : new URLSearchParams([["redirectTo", safeRedirect(redirectTo)]])

  if (action === 'next') {

    const userData = { name: data?.name, email: data?.email, cpf: data?.cpf, rg: data?.rg }
    const user = await getExistingUser(userData)

    if (data.email?.length === 0)
      return json(
        { errors: { email: "Preencha com seu e-mail" } },
        { status: 400 }
      );
    if (data.email) {
      if (data.email === user?.email)
        return json(
          { errors: { email: "E-mail já utilizado" } },
          { status: 400 }
        );
      if (typeof data.email !== "string" || !validateEmail(data.email))
        return json(
          { errors: { email: "E-mail inválido" } },
          { status: 400 }
        );
    }

    if (data.password?.length === 0)
      return json(
        { errors: { password: "Digite a senha" } },
        { status: 400 }
      );
    if (data.confirmPassword?.length === 0)
      return json(
        { errors: { confirmPassword: "Digite a senha" } },
        { status: 400 }
      );
    if (data.password) {
      if (data.password.length < 8)
        return json(
          { errors: { password: "Senha muito curta" } },
          { status: 400 }
        );

      if (data.password !== data.confirmPassword)
        return json(
          { errors: { confirmPassword: "As senhas são diferentes" } },
          { status: 400 }
        );
    }

    if (data.name?.length === 0)
      return json(
        { errors: { name: "Preencha com o seu Nome" } },
        { status: 400 }
      );
    if (data.name) {
      if (data.name === user?.name)
        return json(
          { errors: { name: "Nome já utilizado" } },
          { status: 400 }
        );
      if (typeof data.name !== "string" || checkString(data.name) || data.name === "")
        return json(
          { errors: { name: "Nome inválido" } },
          { status: 400 }
        );
    }

    if (data.cpf?.length === 0)
      return json(
        { errors: { cpf: "Digite seu cpf" } },
        { status: 400 }
      );
    if (data.cpf) {
      if (data.cpf === user?.cpf)
        return json(
          { errors: { cpf: "Cpf já utilizado" } },
          { status: 400 }
        );
      if (typeof data.cpf !== "string" || data.cpf.length !== 11)
        return json(
          { errors: { cpf: "Cpf Inválido" } },
          { status: 400 }
        );
    }

    if (data.rg?.length === 0)
      return json(
        { errors: { rg: "Digite seu Rg" } },
        { status: 400 }
      );
    if (data.rg) {
      if (data.rg === user?.rg)
        return json(
          { errors: { rg: "Rg já utilizado" } },
          { status: 400 }
        );
      if (typeof data.rg !== "string" || data.rg.length !== 9)
        return json(
          { errors: { rg: "Rg Inválido" } },
          { status: 400 }
        );
    }

    if (data.phoneNumber?.length === 0)
      return json(
        { errors: { phoneNumber: "Digite seu Númro de Celular" } },
        { status: 400 }
      );
    if (data.phoneNumber) {
      if (typeof data.phoneNumber !== "string" || !validatePhoneNumber(data.phoneNumber))
        return json(
          { errors: { phoneNumber: "Número de celular inválido" } },
          { status: 400 }
        );
    }

    if (data.birthDate?.length === 0)
      return json(
        { errors: { birthDate: "Preencha a Data de nascimento" } },
        { status: 400 }
      );
    if (data.birthDate) {
      if (typeof data.birthDate !== "string" || data.birthDate.length !== 10)
        return json(
          { errors: { birthDate: "Data de Nascimento inválida" } },
          { status: 400 }
        );
    }

    const userType = session.get("user-type")?.userType

    if (step == 4 && userType === "delegate") {
      if (data.council === undefined) {
        return json(
          { errors: { council: "Escolha uma opção" } },
          { status: 400 }
        );
      }
      if (data.language === undefined) {
        return json(
          { errors: { language: "Escolha no mínimo uma opção" } },
          { status: 400 }
        );
      }
    }

    if (step == 6) {
      const userData = {
        ...session.get("user-data-1"),
        ...session.get("user-data-2"),
        ...session.get("user-data-3"),
        ...session.get("user-data-5"),
        ...session.get("user-type"),
      }
      const user = await createUser(userData)

      console.log(user)

      return createUserSession({
        request,
        userId: user.id,
        redirectTo: redirectTo ? safeRedirect(redirectTo) : `/join/delegation?${searchParams}`,
      });
    }
  }

  const nextStep = userType ? 5 : Number(step) + (action === 'next' ? 1 : -1)
  session.set(`user-data-${step}`, data)
  if (userType) session.set('user-type', { userType: userType })
  session.set('current-step', { step: nextStep })

  return redirect(`/join/user?${searchParams}`, {
    headers: {
      'set-cookie': await sessionStorage.commitSession(session),
    },
  })
}

export const loader = async ({ request }) => {
  const userId = await getUserId(request)
  if (userId) return redirect("/")

  const session = await getSession(request)

  const { userType, step } = {
    ...session.get("current-step"),
    ...session.get("user-type"),
  }
  console.log(step)
  if (step === 6) {
    const data = {
      ...session.get("user-data-1"),
      ...session.get("user-data-2"),
      ...session.get("user-data-3"),
      ...session.get("user-data-5"),
    }
    /* console.log("loader data")
    console.log(data) */
    return json({ data, step, userType })
  } else {
    const data = session.get(`user-data-${step}`) ?? {}
    return json({ data, step, userType })
  }
}

const Nacionality = ({ data }) => {

  const flagIcons = {
    Brasil: br,
    Alemanha: de,
    Espanha: es,
    Franca: fr,
    Mexico: mx,
    Portugal: pt,
    Estados_Unidos: us,
  }

  const [flag, setFlag] = useState(data.nacionality ?? "Brasil")
  const [focus, setFocus] = useState(false)

  return (
    <>
      <S.StepTitle style={{ marginTop: '40px' }}>
        Nacionalidade
      </S.StepTitle>

      <S.StepSubtitle>
        Escolha seu país de nascimento
      </S.StepSubtitle>

      <S.NacionalityContainer
        onClick={() => setFocus(true)}
        focused={focus}
      >
        <S.NacionalityFlag
          style={{
            backgroundImage: `url(${flagIcons[flag]})`,
          }}
        />

        <S.NacionalitySelect
          value={flag}
          onChange={e => { setFlag(e.target.value); setFocus(false) }}
          name="nacionality"
          onBlur={() => setFocus(false)}
        >

          <S.Option value={"Brasil"}>Brasil</S.Option>
          <S.Option value={"Portugal"}>Portugal</S.Option>
          <S.Option value={"Franca"}>França</S.Option>
          <S.Option value={"Estados_Unidos"}>Estados Unidos</S.Option>
          <S.Option value={"Espanha"}>Espanha</S.Option>
          <S.Option value={"Alemanha"}>Alemanha</S.Option>
          <S.Option value={"México"}>México</S.Option>
        </S.NacionalitySelect>
      </S.NacionalityContainer>
    </>
  )
}

const CreateUser = ({ data, actionData }) => {
  return (
    <>
      <S.StepTitle>
        Criar Conta
      </S.StepTitle>

      <S.InputContainer>
        <AuthInputBox
          name="email"
          text="E-mail"
          type="email"
          value={data?.email}
          err={actionData?.errors?.email}
          autoFocus={true}
        />

        <div />

        <S.SubInputContainer>
          <AuthInputBox
            name="password"
            text="Senha"
            type="password"
            value={data?.password}
            err={actionData?.errors?.password}
          />

          <AuthInputBox
            name="confirmPassword"
            text="Confirme a Senha"
            type="password"
            value={data?.confirmPassword}
            err={actionData?.errors?.confirmPassword}
          />
        </S.SubInputContainer>

      </S.InputContainer>
    </>
  )
}

const UserData = ({ data, actionData }) => {
  return (
    <>
      <S.StepTitle>
        Dados Pessoais
      </S.StepTitle>

      <S.InputContainer>
        <AuthInputBox
          name="name"
          text="Nome"
          type="text"
          value={data?.name}
          err={actionData?.errors?.name}
          autoFocus={true}
        />

        <div />

        <S.SubInputContainer>
          <AuthInputBox
            name="cpf"
            text="Cpf"
            type="text"
            value={data?.cpf}
            err={actionData?.errors?.cpf}
          />

          <AuthInputBox
            name="rg"
            text="Rg"
            type="text"
            value={data?.rg}
            err={actionData?.errors?.rg}
          />
        </S.SubInputContainer>

        <S.SubInputContainer>
          <AuthInputBox
            name="birthDate"
            text="Data de Nascimento"
            type="text"
            value={data?.birthDate}
            err={actionData?.errors?.birthDate}
          />
        </S.SubInputContainer>

        <S.SubInputContainer>
          <AuthInputBox
            name="phoneNumber"
            text="Telefone"
            type="text"
            value={data?.phoneNumber}
            err={actionData?.errors?.phoneNumber}
          />
        </S.SubInputContainer>
      </S.InputContainer>
    </>
  )
}

const UserType = () => {
  return (
    <>
      <S.StepTitle>
        Como voce deseja se inscrever?
      </S.StepTitle>

      <S.StepSubtitle>
      </S.StepSubtitle>

      <S.StepButtonsContainer>
        <S.StepButton name="userType" type="submit" value="advisor">
          Professor Orientador
        </S.StepButton>

        <S.StepButton name="userType" type="submit" value="delegate">
          Delegado
        </S.StepButton>
      </S.StepButtonsContainer>
    </>
  )
}

const DelegateData = ({ data, actionData }) => {
  return (
    <>
      <S.StepTitle>
        Preferencias
      </S.StepTitle>

      <S.CheckBoxGrid>
        <S.CheckBoxWrapper>
          <S.CheckBoxTitle err={actionData?.errors.council}>
            {actionData?.errors.council ? <><FiAlertTriangle /> {actionData?.errors.council} </> : 'Preferencias de Conselho :'}
          </S.CheckBoxTitle>

          {['Assembleia Geral da ONU', 'Rio 92', 'Conselho de Juventude da ONU', 'Conselho de Seguranca da ONU'].map((item, index) => (
            <S.CheckBoxContainer>
              <S.CheckBox
                id={`council-${item}`}
                name="council"
                value={item}
                defaultChecked={
                  data?.council === `${item}`
                }
                type="radio"
              />

              <S.CheckBoxLabelContainer>
                <S.CheckBoxLabel>
                  {item}
                </S.CheckBoxLabel>
              </S.CheckBoxLabelContainer>
            </S.CheckBoxContainer>
          ))}
        </S.CheckBoxWrapper>

        <S.CheckBoxWrapper>
          <S.CheckBoxTitle err={actionData?.errors.language}>
            {actionData?.errors.language ? <><FiAlertTriangle /> {actionData?.errors.language} </> : 'Idiomas fluentes :'}
          </S.CheckBoxTitle>

          {console.log(data.language)}

          {["Portugues", "Ingles", "Espanhol"].map((item, index) => (
            <S.CheckBoxContainer>
              <S.CheckBox
                id={item}
                name="language"
                value={item}
                defaultChecked={data?.language?.includes(
                  `${item}`
                )}
                type="checkbox"
              />

              <S.CheckBoxLabelContainer>
                <S.CheckBoxLabel>
                  {item}
                </S.CheckBoxLabel>
              </S.CheckBoxLabelContainer>
            </S.CheckBoxContainer>
          ))}
        </S.CheckBoxWrapper>
      </S.CheckBoxGrid>
    </>
  )
}

const AdvisorData = ({ data }) => {

  const { council, language, role, ..._data } = data
  const [values, setValues] = useState(_data)
  const valuesArray = Object.entries(values)

  const inputRef = useRef(null)
  const [selectValue, setSelectValue] = useState("Instagram")

  const addSM = (e) => {
    e.preventDefault();
    if (inputRef?.current.value.length > 0) setValues({ ...values, [selectValue]: inputRef?.current.value })
  }

  const removeSM = (e, item) => {
    e.preventDefault();
    let copyOfValues = { ...values }
    delete copyOfValues[item]
    setValues(copyOfValues);
  }

  return (
    <>
      <S.StepTitle>
        Dados do Orientador
      </S.StepTitle>

      <S.CheckBoxGrid>
        <S.SMContainer padding={valuesArray.length > 0}>
          <S.SMLabel>
            Redes Sociais
          </S.SMLabel>

          <S.SMAddContainer>
            <S.SMAdd
              value={selectValue}
              onChange={e => {
                setSelectValue(e.target.value)
                inputRef.current.value = values[e.target.value] ?? inputRef.current.value
              }}
            >
              <S.SMAddOption>Instagram</S.SMAddOption>
              <S.SMAddOption>Facebook</S.SMAddOption>
              <S.SMAddOption>Linkedin</S.SMAddOption>
              <S.SMAddOption>Twitter</S.SMAddOption>
            </S.SMAdd>

            <S.SMInput
              type="string"
              ref={inputRef}
              placeholder="nome de usuario"
            />

            <S.SMButton onClick={addSM}>
              {values.hasOwnProperty(selectValue) ? "Editar" : "Adicionar"}
            </S.SMButton>

          </S.SMAddContainer>

          <S.SMValueList>
            {valuesArray.map((item, index) => {
              const active = selectValue === item[0]
              return (
                <S.SMValueItem
                  first={index === 0}
                  key={`sm-${item[0]}`}
                  active={active}
                  onClick={() => setSelectValue(item[0])}
                >
                  <input type="hidden" name={item[0]} value={item[1]} />
                  <S.SMName>{item[0]}</S.SMName>
                  <S.SMValue>
                    {item[1]}
                  </S.SMValue>
                  <S.SMDeleteButton onClick={e => removeSM(e, item[0])}>
                    <FiTrash2 />
                  </S.SMDeleteButton>
                </S.SMValueItem>
              )
            })}
          </S.SMValueList>
        </S.SMContainer>

        <S.AdvidorRoleContainer>
          <S.SMLabel>
            Posição do orientador
          </S.SMLabel>

          <S.SMAddContainer>
            <S.AdvisorRoleSelect
              name="role"
              defaultValue={role}
            >
              <S.SMAddOption>Professor</S.SMAddOption>
              <S.SMAddOption>Coordenador</S.SMAddOption>
              <S.SMAddOption>Diretor</S.SMAddOption>
              <S.SMAddOption>Outro</S.SMAddOption>
            </S.AdvisorRoleSelect>
          </S.SMAddContainer>
        </S.AdvidorRoleContainer>
      </S.CheckBoxGrid>
    </>
  )
}

const ConfirmData = ({ data, userType }) => {
  const { password, confirmPassword, ...dataWithoutPassword } = data
  return (
    <>
      <S.StepTitle>
        Confirmar os dados
      </S.StepTitle>

      <S.StepSubtitle>
        É possível alterar os dados após a inscrição
      </S.StepSubtitle>

      <S.ConfirmList>
        <S.ConfirmColumn>
          {[
            ["Nacionalidade", "nacionality"],
            ["Nome", "name"],
            ["E-mail", "email"],
            ["Telefone", "phoneNumber"],
          ].map((item, index) => {
            return (
              <S.ConfirmItem key={`1-delegation-${index}`}>
                <S.ConfirmLabel>
                  {item[0]}
                </S.ConfirmLabel>
                {data[item[1]]}
              </S.ConfirmItem>
            )
          })}
        </S.ConfirmColumn>

        <S.ConfirmColumn>
          {[
            ["Cpf", "cpf"],
            ["Rg", "rg"],
            ["Data de aniversário", "birthDate"],
          ].map((item, index) => {
            return (
              <S.ConfirmItem key={`2-delegation-${index}`}>
                <S.ConfirmLabel>
                  {item[0]}
                </S.ConfirmLabel>
                {data[item[1]]}
              </S.ConfirmItem>
            )
          })}
        </S.ConfirmColumn>

        <S.ConfirmColumn>
          <S.ConfirmItem>
            <S.ConfirmLabel>
              {data.role ? "Posição" : "Preferência de Conselho"}
            </S.ConfirmLabel>
            {data.role ?? data.council}
          </S.ConfirmItem>

          {data.language &&
            <S.ConfirmItem>
              <S.ConfirmLabel>
                Idiomas Fluentes
              </S.ConfirmLabel>
              {Array.isArray(data.language) ?
                data.language.map((item, index) => (
                  <p>
                    {item}
                  </p>
                )) :
                data.language
              }
            </S.ConfirmItem>
          }
        </S.ConfirmColumn>

        <S.ConfirmColumn>
          {userType === "advisor" &&
            [
              ["Instagram", "Instagram"],
              ["Facebook", "Facebook"],
              ["Linkedin", "Linkedin"],
              ["Twitter", "Twitter"]
            ].map((item, index) => {
              if (!data[item[1]]) return null
              return (
                <S.ConfirmItem key={`4-delegation-${index}`}>
                  <S.ConfirmLabel>
                    {item[0]}
                  </S.ConfirmLabel>
                  {data[item[1]]}
                </S.ConfirmItem>
              )
            })}
        </S.ConfirmColumn>
      </S.ConfirmList>
    </>
  )
}

const user = () => {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "";
  console.log(redirectTo)

  const actionData = useActionData()
  let { userType, step, data } = useLoaderData()
  if (!step) step = 1

  return (
    <S.StepsForm noValidate method='post'>
      <input type="hidden" name="step" value={step} />
      <input type="hidden" name="redirectTo" value={redirectTo} />

      {step === 1 && <Nacionality data={data} />}
      {step === 2 && <CreateUser data={data} actionData={actionData} />}
      {step === 3 && <UserData data={data} actionData={actionData} />}
      {step === 4 && <UserType data={data} actionData={actionData} />}
      {step === 5 && (userType === "advisor" ? <AdvisorData data={data} actionData={actionData} /> : <DelegateData data={data} actionData={actionData} />)}
      {step === 6 && <ConfirmData data={data} userType={userType} />}

      <S.ControlButtonsContainer>
        {step !== 1 && <S.ControlButton name="action" value="previous" type="submit" prev> Voltar </S.ControlButton>}

        {step !== 4 && <S.ControlButton name="action" value="next" type="submit"> {step === 6 ? 'Finalizar' : 'Próximo'} </S.ControlButton>}
      </S.ControlButtonsContainer>
    </S.StepsForm>
  )
}

export default user
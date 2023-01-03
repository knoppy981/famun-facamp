import { useState, useEffect } from 'react'
import { useOutletContext, useActionData, useTransition, Link, Form, useNavigate } from '@remix-run/react'
import { json } from '@remix-run/node'

import { requireUserId } from '~/session.server'
import { updateUser, getExistingUser } from '~/models/user.server'
import { validatePhoneNumber, checkString, useUser } from "~/utils";

import InputBox from '~/styled-components/components/inputs/dataInput2'
import * as S from '~/styled-components/dashboard/data'

export const action = async ({ request }) => {
  const userId = await requireUserId(request)
  const formData = await request.formData();
  const _values = formData.get("values");
  const values = JSON.parse(_values)

  if (Object.values(values).every(value => value === ''))
    return json(
      { errors: { error: "Invalid values" } },
      { status: 400 }
    );

  const user = await getExistingUser(values)

  for (const [key, value] of Object.entries(values)) {
    if (value === '')
      delete values[key]
  }

  if (values["name"]) {
    if (typeof values["name"] !== "string" || !checkString(values["name"]) || data.name === "")
      return json(
        { errors: { name: "Nome inválido" } },
        { status: 400 }
      );
    if (values["name"] === user?.name)
      return json(
        { errors: { name: "Nome já utilizado" } },
        { status: 400 }
      );
  }

  if (values["cpf"]) {
    if (typeof values["cpf"] !== "string" || values["cpf"].length !== 11)
      return json(
        { errors: { cpf: "Cpf inválido" } },
        { status: 400 }
      );
    if (values["cpf"] === user?.cpf)
      return json(
        { errors: { cpf: "Cpf já utilizado" } },
        { status: 400 }
      );
  }

  if (values["rg"]) {
    if (typeof values["rg"] !== "string" || values["rg"].length !== 9)
      return json(
        { errors: { rg: "Rg inválido" } },
        { status: 400 }
      );
    if (values["rg"] === user?.rg)
      return json(
        { errors: { rg: "Rg já utilizado" } },
        { status: 400 }
      );
  }

  if (values["phoneNumber"]) {
    if (typeof values["phoneNumber"] !== "string" || !validatePhoneNumber(values["phoneNumber"]))
      return json(
        { errors: { phoneNumber: "Número de celular inválido" } },
        { status: 400 }
      );
  }

  if (values["birthDate"]) {
    if (typeof values["birthDate"] !== "string" || values["birthDate"].length !== 10)
      return json(
        { errors: { birthDate: "Data de Aniversário inválida" } },
        { status: 400 }
      );
  }

  await updateUser({ userId, values })

  return json({ values })
}

const data = () => {

  const user = useUser()
  console.log(user)
  const actionData = useActionData();

  const [showButton, setShowButton] = useState(false)
  const [values, setValues] = useState({
    email: '',
    name: '',
    cpf: '',
    rg: '',
    phoneNumber: '',
    birthDate: ''
  })

  const handleChange = name => event => {
    if (user[name].toString() === event.target.value) {
      setValues({ ...values, [name]: '' })
    } else {
      setValues({ ...values, [name]: event.target.value })
      setShowButton(true)
    }
  }

  useEffect(() => {
    const change = Object.values(values).every(value => value === '')
    if (change) {
      setShowButton(false)
    }
  }, [values])

  const [shadowBackground, setShadowBackground] = useState(false)
  const transition = useTransition()

  useEffect(() => {
    if (actionData?.values) {
      setValues({
        email: '',
        name: '',
        cpf: '',
        rg: '',
        phoneNumber: '',
        birthDate: ''
      })
    }
    if (transition.state === "loading" && actionData?.values) setShadowBackground(true)
  }, [actionData, transition])

  const navigate = useNavigate()
  const refresh = () => {
    navigate('/', { replace: true })
  }

  return (
    <S.FormContainer method="post">
      <S.Title>
        Editar Dados
      </S.Title>

      <S.Grid columns={"1fr 1fr"}>
        <InputBox
          text="E-mail"
          name="email"
          placeholder="Digite o novo e-mail"
          type="email"
          value={user.email}
          handleChange={handleChange}
          actionData={actionData}
          disabled={true}
        />

        <InputBox
          text="Nome"
          name="name"
          placeholder="Digite o novo nome"
          type="text"
          value={user.name}
          handleChange={handleChange}
          transition={transition}
          actionData={actionData}
        />

        <InputBox
          text="Cpf"
          name="cpf"
          placeholder="Digite o novo cpf"
          type="text"
          value={user.cpf}
          handleChange={handleChange}
          transition={transition}
          actionData={actionData}
        />

        <InputBox
          text="Rg"
          name="rg"
          placeholder="Digite o novo rg"
          type="text"
          value={user.rg}
          handleChange={handleChange}
          transition={transition}
          actionData={actionData}
        />

        <InputBox
          text="Numero Celular"
          name="phoneNumber"
          placeholder="Digite o novo número"
          type="text"
          value={user.phoneNumber}
          handleChange={handleChange}
          transition={transition}
          actionData={actionData}
        />

        <InputBox
          text="Data de Nascimento"
          name="birthDate"
          placeholder="Escolha a data de Nascimento"
          type="text"
          value={user.birthDate}
          handleChange={handleChange}
          transition={transition}
          actionData={actionData}
        />

        <S.SubmitButton type="submit" disabled={!showButton}>
          Save Changes
        </S.SubmitButton>
      </S.Grid>

      <input type='hidden' name="values" value={JSON.stringify(values)} />

    </S.FormContainer>
  )
}

export default data
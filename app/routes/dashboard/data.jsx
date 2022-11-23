import { useState, useEffect } from 'react'
import { useOutletContext, useActionData, useTransition } from '@remix-run/react'
import { json } from '@remix-run/node'

import { requireUserId } from '~/session.server'
import { updateUser, getExistingUser } from '~/models/user.server'
import { validatePhoneNumber, checkString } from "~/utils";

import DataInput2 from '~/styled-components/components/inputs/dataInput2'
import * as S from '~/styled-components/dashboard/data'
import { FiX } from 'react-icons/fi'

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

  /* console.log(user) */

  for (const [key, value] of Object.entries(values)) {
    if (value === '')
      delete values[key]
  }

  if (values["name"]) {
    if (values["name"] === user?.name)
      return json(
        { errors: { name: "Name taken" } },
        { status: 400 }
      );
    if (typeof values["name"] !== "string" || checkString(values["name"]))
      return json(
        { errors: { name: "Invalid Name" } },
        { status: 400 }
      );
  }

  if (values["cpf"]) {
    if (values["cpf"] === user?.cpf)
      return json(
        { errors: { cpf: "Cpf taken" } },
        { status: 400 }
      );
    if (typeof values["cpf"] !== "string" || values["cpf"].length !== 11)
      return json(
        { errors: { cpf: "Invalid Cpf" } },
        { status: 400 }
      );
  }

  if (values["rg"]) {
    if (values["rg"] === user?.rg)
      return json(
        { errors: { rg: "Rg taken" } },
        { status: 400 }
      );
    if (typeof values["rg"] !== "string" || values["rg"].length !== 9)
      return json(
        { errors: { rg: "Invalid Rg" } },
        { status: 400 }
      );
  }

  if (values["phoneNumber"]) {
    if (typeof values["phoneNumber"] !== "string" || !validatePhoneNumber(values["phoneNumber"]))
      return json(
        { errors: { phoneNumber: "Invalid Phone Number" } },
        { status: 400 }
      );
  }

  if (values["birthDate"]) {
    if (typeof values["birthDate"] !== "string" || values["birthDate"].length !== 9)
      return json(
        { errors: { birthDate: "Invalid Birthdate" } },
        { status: 400 }
      );
  }

  await updateUser({ userId, values })

  return json({ values })
}

const data = () => {

  const { user } = useOutletContext()
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
    if (transition.state === "loading" && actionData?.values) setShadowBackground(true)
  }, [actionData, transition])

  return (
    <S.FormContainer method="post">
      <S.ShadowBackground show={shadowBackground}>
        <S.ClickableBackground onClick={() => setShadowBackground(false)} />

        <S.BackgroundContainer>
          <S.BackgroundCloseButton onClick={() => setShadowBackground(false)}>
            <FiX />
          </S.BackgroundCloseButton>

          <S.BackgroundDataContainer>
            {actionData?.values && Object.entries(actionData.values).map((item, index) => (
              <>
                <S.BackgroundTitle>
                  {item[0]} has changed to : 
                </S.BackgroundTitle>

                <S.BackgroundData>
                  {item[1]}
                </S.BackgroundData>
              </>
            ))}
          </S.BackgroundDataContainer>

          <S.BackgroundButton onClick={() => setShadowBackground(false)}>
            Voltar
          </S.BackgroundButton>
        </S.BackgroundContainer>
      </S.ShadowBackground>

      <S.Title>
        Dados Cadastrais
      </S.Title>

      <S.Grid columns={"1fr 1fr"}>
        <DataInput2
          text="E-mail"
          name="email"
          placeholder="Digite o novo e-mail"
          type="email"
          value={user.email}
          disabled={true}
          handleChange={handleChange}
          err={actionData?.errors?.email}
        />

        <DataInput2
          text="Nome"
          name="name"
          placeholder="Digite o novo nome"
          type="text"
          value={user.name}
          handleChange={handleChange}
          err={actionData?.errors?.name}
        />

        <DataInput2
          text="Cpf"
          name="cpf"
          placeholder="Digite o novo cpf"
          type="text"
          value={user.cpf}
          handleChange={handleChange}
          err={actionData?.errors?.cpf}
        />

        <DataInput2
          text="Rg"
          name="rg"
          placeholder="Digite o novo rg"
          type="text"
          value={user.rg}
          handleChange={handleChange}
          err={actionData?.errors?.rg}
        />

        <DataInput2
          text="Numero Celular"
          name="phoneNumber"
          placeholder="Digite o novo número"
          type="text"
          value={user.phoneNumber}
          handleChange={handleChange}
          err={actionData?.errors?.phoneNumber}
        />

        <DataInput2
          text="Data de Nascimento"
          name="birthDate"
          placeholder="Escolha a data de Nascimento"
          type="text"
          value={user.birthDate}
          handleChange={handleChange}
          err={actionData?.errors?.birthDate}
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
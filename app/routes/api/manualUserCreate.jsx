import { json } from "@remix-run/node"
import { createUser, getExistingUser } from "~/models/user.server"
import { joinDelegationById } from "~/models/delegation.server"
import { checkUserInputData, generatePassword } from "~/utils"
import qs from 'qs'
import bcrypt from "bcryptjs";

export const action = async ({ request }) => {
  const formData = await request.formData()
  const data = qs.parse(formData.get("data"))
  const delegationId = formData.get("delegationId")

  data.delegate ? data.delegate = { create: data.delegate } : delete data.delegate
  data.delegationAdvisor ? data.delegationAdvisor = { create: data.delegationAdvisor } : delete data.delegationAdvisor

  const existingUserData = { name: data?.name, email: data?.email, document: { is: { value: data.document.value } } }
  let existingUser = await getExistingUser(existingUserData)

  try {
    checkUserInputData([
      { key: "name", value: data.name, errorMessages: { undefined: "Name is required", invalid: "Invalid name", existingUser: "Name already taken" }, valuesToCompare: [existingUser?.name] },
      { key: "email", value: data.email, errorMessages: { undefined: "E-mail is required", invalid: "Invalid e-mail", existingUser: "E-mail already taken" }, valuesToCompare: [existingUser?.email] },
      { key: "phoneNumber", value: data.phoneNumber, errorMessages: { undefined: "Phone number is required", invalid: "Invalid phone number" } },
      { key: "birthDate", value: data.birthDate, errorMessages: { undefined: "Birth date is required", invalid: "Invalid birth date" } },
      { key: "cpf", value: data.document.value, errorMessages: { undefined: "Cpf is required", invalid: "Invalid cpf", existingUser: "Cpf already taken" }, valuesToCompare: [existingUser?.document?.value], dontValidate: data.document.documentName !== "cpf" },
      { key: "passport", value: data.document.value, errorMessages: { undefined: "Passport number is required", invalid: "Invalid passport number", existingUser: "Passport number already taken" }, valuesToCompare: [existingUser?.document?.value], dontValidate: data.document.documentName !== "passport" },
      { key: "emergencyContactName", value: data.delegate?.create.emergencyContactName, errorMessages: { undefined: "Name is required", invalid: "Invalid name" }, dontValidate: data.delegate ? false : true },
      { key: "emergencyContactPhoneNumber", value: data.delegate?.create.emergencyContactPhoneNumber, errorMessages: { undefined: "Phone number is required", invalid: "Invalid phone number" }, dontValidate: data.delegate ? false : true },
      { key: "languagesSimulates", value: data.delegate?.create.languagesSimulates, errorMessages: { undefined: "Select at least one language", invalid: "Invalid language" }, dontValidate: data.delegate ? false : true },

    ])
  } catch (error) {
    error = qs.parse(error.message)
    return json(
      { errors: { [error.key]: error.msg } },
      { status: 400 }
    );
  }

  const tempPassword = generatePassword()

  data.password = { create: { hash: await bcrypt.hash(tempPassword, 10) } }

  const user = await createUser(data)
    .catch(e => console.log(e))

  await joinDelegationById(delegationId, user.id)
    .catch(e => console.log(e))

  return json(user)
}
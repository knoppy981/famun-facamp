import { json } from "@remix-run/node"
import { createUser, getExistingUser } from "~/models/user.server"
import { joinDelegationById } from "~/models/delegation.server"
import { generatePassword } from "~/utils"
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
    
  } catch (error) {
    console.log(error)
    error = qs.parse(error.message)
    console.log(error.key)
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
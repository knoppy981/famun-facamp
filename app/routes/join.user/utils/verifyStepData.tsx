import { getExistingUser } from "~/models/user.server"
import { userStepValidation } from "~/schemas"

export async function verifyStepData(data: { [key: string]: any }, step: number) {
  await userStepValidation(step, data)
  if (step === 4 || step === 5) {
    await getExistingUser({
      name: data.name === "" ? undefined : data.name,
      email: data.email === "" ? undefined : data.email,
      cpf: data.cpf === "" ? undefined : data.cpf,
      rg: data.rg === "" ? undefined : data.rg,
      passport: data.passport === "" ? undefined : data.passport,
    })
  }
}
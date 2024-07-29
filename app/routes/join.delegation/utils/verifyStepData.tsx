import { getExistingDelegation } from "~/models/delegation.server"
import { delegationStepValidation } from "~/schemas"

export async function verifyStepData(data: { [key: string]: any }, step: number) {
  await delegationStepValidation(Number(step), data)
  await getExistingDelegation({ school: data.school ?? "" })
}
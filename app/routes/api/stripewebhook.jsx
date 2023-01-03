import { handleWebHook } from "~/stripe.server"

export const action = async ({ request }) => {
  try {
    return handleWebHook(request)
  } catch (err) {
    return err
  }
}
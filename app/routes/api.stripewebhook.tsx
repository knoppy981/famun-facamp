import { ActionFunctionArgs } from "@remix-run/node"

import { handleWebHook } from "~/stripe.server"

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    return handleWebHook(request)
  } catch (err) {
    return err
  }
}
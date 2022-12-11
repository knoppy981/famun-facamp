import { json } from "@remix-run/node"

import { updateInviteLink } from "~/models/delegation.server";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const delegationCode = formData.get("delegationCode");
  return updateInviteLink(delegationCode)
}
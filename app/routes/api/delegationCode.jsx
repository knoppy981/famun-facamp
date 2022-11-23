import { json, redirect } from "@remix-run/node"

import { findDelegationCode } from "~/models/delegation.server"

export const action = async ({ request }) => {
  const formData = await request.formData()
  const delegationCode = formData.get("delegationCode")

  if (typeof delegationCode !== "string" || delegationCode.length !== 6) {
    return json(
      { errors: { code: "Código invalido" } },
      { status: 400 }
    );
  } else {
    const delegation = await findDelegationCode(delegationCode);
    if (!delegation) {
      return json(
        { errors: { delegation: "Não encontramos sua delegação" } },
        { status: 400 }
      );
    } 
    return json({ delegation });
  }
}
import { json, redirect } from "@remix-run/node"

import { getDelegationByCode } from "~/models/delegation.server"

export const action = async ({ request }) => {
  const formData = await request.formData()
  const delegationCode = formData.get("delegationCode")

  if (typeof delegationCode !== "string" || delegationCode.length !== 6 || !delegationCode.match(/^[A-Za-z0-9]+$/)) {
    return json(
      { errors: { code: "Código invalido" } },
      { status: 400 }
    );
  } else {
    const delegation = await getDelegationByCode(delegationCode);
    if (!delegation) {
      return json(
        { errors: { delegation: "Não encontramos sua delegação" } },
        { status: 400 }
      );
    } 
    return json({ delegation });
  }
}
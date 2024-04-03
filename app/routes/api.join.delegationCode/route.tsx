import { ActionFunctionArgs, json, redirect } from "@remix-run/node"
import { getDelegationByCode } from "~/models/delegation.server";
import checkJoinDelegation from "~/utils/checkJoinDelegation";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const delegationCode = formData.get("delegationCode")
  const userId = formData.get("userId") as string

  if (typeof delegationCode !== "string" || delegationCode.length !== 6 || !delegationCode.match(/^[A-Za-z0-9]+$/)) {
    return json(
      { errors: { code: "Código invalido" } },
      { status: 400 }
    );
  } else {
    const delegation = await getDelegationByCode(delegationCode);

    try {
      await checkJoinDelegation(delegation?.id, userId)
    } catch (error: any) {
      return json(
        { errors: { delegation: error.message } },
        { status: 404 }
      )
    }


    return json({ delegation });
  }
}
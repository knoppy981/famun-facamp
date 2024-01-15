import { json } from "@remix-run/node";
import { getDelegationById } from "~/models/delegation.server";
import { getUserById } from "~/models/user.server";

export default async function checkJoinDelegation(delegationId: string | undefined, userId: string | undefined) {
  if (!delegationId || !userId) return

  const delegation = await getDelegationById(delegationId)
  const user = await getUserById(userId)

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  if (user?.delegationId) {
    throw new Error("Você já está em uma delegação!")
  }

  if (!delegation) {
    throw new Error("Delegação não encontrada");
  }

  if (user?.delegate && delegation?._count.participants && delegation?._count.participants >= 10) {
    throw new Error(`A delegação ${delegation.school} já está lotada, o máximo de delegados permitidos por delegação são 10, entre em contato 
      com o líder de sua delegação ou com professores orientadores para checar se ainda há uma vaga para você.
      Se o error persistir entre em contanto com a nossa equipe`);
  }

  if (user.participationMethod !== delegation.participationMethod) {
    throw new Error(`Usuários que se inscreverem para participar do tipo ${user.participationMethod} não podem se juntar a delegações de ${delegation.participationMethod}s`);
  }

  return
}
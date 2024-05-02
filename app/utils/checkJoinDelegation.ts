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

  if (user?.delegate && delegation?._count.participants && delegation?._count.participants >= delegation.maxParticipants) {
    throw new Error(`
    A delegação ${delegation.school} já atingiu o número máximo de delegados permitidos, que são ${delegation.maxParticipants}, 
    Entre em contato com seu(sua) Chefe de Delegação ou seu(a) Professor(a) Orientador(a) para verificar se ainda há uma vaga para você. Se o erro persistir, 
    entre em contato com nossa equipe pelo email famun@facamp.com.br 
    `);
  }

  if (user.participationMethod !== delegation.participationMethod) {
    throw new Error(`Usuários que se inscreverem para participar do tipo ${user.participationMethod} não podem se juntar a delegações de ${delegation.participationMethod}s`);
  }

  return
}
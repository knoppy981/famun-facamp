import { ParticipationMethod } from "@prisma/client";
import { json, Session, SessionData } from "@remix-run/node";
import { decodeJwt } from "~/jwt";
import { checkSubscriptionAvailability } from "~/models/configuration.server";
import { checkJoinAuthenticationCode } from "./checkJoinAuthenticationCode";

export async function verifyJoinAuthentication(participationMethod: ParticipationMethod, session: Session<SessionData, SessionData>, searchParams: URLSearchParams) {
  const isSubscriptionAvailable = await checkSubscriptionAvailability()

  if ((participationMethod === "Escola" && !isSubscriptionAvailable?.subscriptionEM) || (participationMethod === "Universidade" && !isSubscriptionAvailable?.subscriptionUNI)) {
    const token = session.get("join-authentication")
    if (token && typeof token === "string") {
      const decoded: any = await decodeJwt(token)
      if (decoded.err) throw json(
        { message: "Link inválido", name: "Erro no Link" },
        { status: 403 }
      );
      if (decoded.payload.code && typeof decoded.payload.code === "string") {
        const check = await checkJoinAuthenticationCode(decoded.payload.code)
        if (!check) {
          throw json(
            { message: "Link inválido", name: "Erro no Link" },
            { status: 403 }
          )
        }
        searchParams.append("token", token)
      }
    } else {
      throw json(
        { message: "Inscrições fechadas", name: "Inscrições" },
        { status: 403 }
      )
    }
  }
}
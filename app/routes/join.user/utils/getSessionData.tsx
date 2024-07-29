import { ParticipationMethod } from "@prisma/client"
import { Session, SessionData } from "@remix-run/node"
import { getCouncils } from "~/models/configuration.server"

export async function getSessionData(LAST_STEP: number, session: Session<SessionData | SessionData>) {
  const { termsAndConditions, userType, step, participationMethod }: { termsAndConditions: string, userType: string, step: number, participationMethod: string } = {
    ...session.get("user-data-1"),
    ...session.get("current-step"),
    ...session.get("user-type"),
    ...session.get("user-participationMethod"),
  }

  let data

  switch (step) {
    case LAST_STEP:
      data = {
        ...session.get("user-data-3"),
        ...session.get("user-data-4"),
        ...session.get("user-data-5"),
        ...session.get("user-data-7"),
      } ?? {}
      break;
    case 5:
      data = {
        ...session.get(`user-data-3`),
        ...session.get(`user-data-5`),
      } ?? {}
      break;
    case 7:
      const councils = await getCouncils(participationMethod as "Escola" | "Universidade")
      data = {
        ...session.get(`user-data-${step}`),
        councils
      } ?? {}
      break;
    default:
      data = session.get(`user-data-${step}`) ?? {}
      break;
  }

  return { data, step, userType, termsAndConditions, participationMethod }
}
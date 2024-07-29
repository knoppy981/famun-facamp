import { Session, SessionData } from "@remix-run/node"

export async function getSessionData(LAST_STEP: number, session: Session<SessionData | SessionData>) {
  const { joinMethod, step }: { joinMethod: string, step: number } = {
    ...session.get("delegation-current-step") ?? {},
    ...session.get("join-method") ?? {},
  }

  let data

  switch (step) {
    case LAST_STEP:
      data = {
        ...session.get("delegation-data-2"),
      }
      break;
    default:
      data = session.get(`delegation-data-${step}`) ?? {}
      break;
  }

  return { data, step, joinMethod }
}
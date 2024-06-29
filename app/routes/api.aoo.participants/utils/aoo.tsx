import { DelegationType } from "~/models/delegation.server";
import { UserType } from "~/models/user.server";

export type ParticipantType = Partial<UserType & {
  delegation: DelegationType
}>

export function participantsAoo(
  participants: ({
    name: string;
    rg: string | null;
    passport: string | null;
  } | {
    name: string;
    delegate: {
      committee: {
        name: string;
      } | null;
      country: string | null;
    } | null;
  } | {
    name: string;
    delegation: {
      school: string;
    } | null;
  })[],
  type: "rg" | "cracha delegados" | "cracha orientadores") {
  const aoo: any[] = []

  function isRgType(participant: any): participant is { name: string; rg: string | null; passport: string | null; } {
    return participant !== undefined;
  }

  function isDelegateType(participant: any): participant is { name: string; delegate: { committee: { name: string; } | null; country: string | null; } | null; } {
    return participant.delegate !== undefined;
  }

  function isAdvisorType(participant: any): participant is { name: string; delegation: { school: string; } | null; } {
    return participant.delegation !== undefined;
  }

  switch (type) {
    case "rg":
      participants.forEach(participant => {
        if (isRgType(participant)) {
          aoo.push({
            "Name": participant.name,
            "Rg": participant.rg ?? "",
            "Passport": participant.passport ?? ""
          })
        }
      })
      break;
    case "cracha delegados":
      participants.forEach(participant => {
        if (isDelegateType(participant)) {
          aoo.push({
            "Name": participant.name,
            "Committee/Council": participant.delegate?.committee?.name,
            "Country": participant.delegate?.country,
          })
        }
      })
      break;
    case "cracha orientadores":
      participants.forEach(participant => {
        if (isAdvisorType(participant)) {
          aoo.push({
            "Name": participant.name,
            "School": participant.delegation?.school,
          })
        }
      })
      break;
  }

  return aoo
}
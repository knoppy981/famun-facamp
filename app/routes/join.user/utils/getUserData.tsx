import { ParticipationMethod } from "@prisma/client";
import { Session, SessionData } from "@remix-run/node";
import bcrypt from "bcryptjs";
import qs from "qs"

export async function getUserData(session: Session<SessionData | SessionData>) {
  const { userType, participationMethod, ...data }: { userType: string, participationMethod: ParticipationMethod, [key: string]: any } = {
    ...session.get("user-data-3"),
    ...session.get("user-data-4"),
    ...session.get("user-data-5"),
    ...session.get("user-data-6"),
    ...session.get("user-data-7"),
    ...session.get("user-type"),
    ...session.get("user-participationMethod"),
  }

  return {
    email: data.email,
    name: data.name.trim(),
    socialName: data.socialName ? data.socialName.trim() : null,
    password: data.password ? {
      create: {
        hash: await bcrypt.hash(data.password, 10)
      }
    } : undefined,
    cpf: data.cpf ? data.cpf.trim() : null,
    rg: data.rg ? data.rg.trim() : null,
    passport: data.passport ? data.passport : null,
    phoneNumber: data.phoneNumber,
    birthDate: data.birthDate,
    nacionality: data.nacionality,
    sex: data.sex,
    participationMethod: participationMethod ?? data.participationMethod ?? undefined,
    //food restrictions
    foodRestrictions: data.diet || data.allergy ? {
      create: {
        diet: data.diet,
        allergy: data.allergy === "on" ? true : false,
        allergyDescription: data.allergy === "on" ? data.allergyDescription.trim() : undefined
      }
    }: undefined,
    //delegate
    delegate: userType === "delegate" ? {
      create: {
        councilPreference: Object.values(qs.parse(data?.councilPreference)),
        languagesSimulates: data?.languagesSimulates,
        emergencyContactName: data.emergencyContactName,
        emergencyContactPhoneNumber: data.emergencyContactPhoneNumber,
        educationLevel: data.educationLevel,
        currentYear: data.currentYear.trim(),
      }
    } : undefined,
    //delegation advisor
    delegationAdvisor: userType === "advisor" ? {
      create: {
        advisorRole: data?.advisorRole?.slice(data?.advisorRole.length - 3) === "(a)" ? data?.advisorRole.slice(0, -3) : data?.advisorRole,
        facebook: data.facebook ?? undefined,
        instagram: data.instagram ?? undefined,
        linkedin: data.linkedin ?? undefined,
      }
    } : undefined,
  }
}
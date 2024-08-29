import { ParticipationMethod } from "@prisma/client";
import { Session, SessionData } from "@remix-run/node";
import bcrypt from "bcryptjs";
import qs from "qs"
import { prisma } from "~/db.server";

export async function getUserData(session: Session<SessionData | SessionData>) {
  const { userType, participationMethod, ...data }: { userType: string, participationMethod: ParticipationMethod, [key: string]: any } = {
    ...session.get("user-data-3"),
    ...session.get("user-data-4"),
    ...session.get("user-data-5"),
    ...session.get("user-data-6"),
    ...session.get("user-data-7"),
    ...session.get("user-type"),
    ...session.get("user-participationMethod"),
    numericId: await generateDelegationCode()
  }

  return {
    numericId: data.numericId,
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

async function generateDelegationCode() {
  let code;
  let isUnique = false;

  while (!isUnique) {
    // Generate a new 6-digit string
    code = Math.floor(10000000 + Math.random() * 90000000);

    try {
      // Try to find a delegation with the generated code
      await prisma.user.findFirstOrThrow({
        where: {
          numericId: code,
        },
      });

      // If no error is thrown, the code exists, so continue looping
    } catch (e) {
      // If an error is thrown, the code does not exist, so it's unique
      isUnique = true;
    }
  }

  // Return the unique code
  return code;
}
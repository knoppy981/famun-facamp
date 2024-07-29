import { Session, SessionData } from "@remix-run/node";
import { generateDelegationInviteLink } from "~/models/delegation.server";
import { generateString } from "~/utils";

export async function getDelegationData(session: Session<SessionData | SessionData>, user: any) {
  let data = {
    ...session.get("delegation-data-2"),
    ...session.get("delegation-data-3"),
    user: user,
    participationMethod: user.participationMethod,
    paymentExpirationDate: generateDate(),
    code: generateString(6),
  }

  return {
    code: data.code,
    inviteLink: await generateDelegationInviteLink(data.code),
    participationMethod: data.participationMethod,
    maxParticipants: parseInt(data.maxParticipants),
    school: data.school.trim(),
    schoolPhoneNumber: data.schoolPhoneNumber,
    paymentExpirationDate: data.paymentExpirationDate,
    address: {
      create: {
        address: data.address.trim(),
        postalCode: data.postalCode,
        city: data.city.trim(),
        country: data.country,
        state: data.state.trim(),
      }
    },
    participants: {
      connect: {
        id: data.user.id
      }
    }
  }
}

function generateDate(){
  let currentDate = new Date();
  let dayOfWeek = currentDate.getDay();
  let daysToAdd = (dayOfWeek >= 2 && dayOfWeek <= 5) ? 7 : 5;
  let newDate = new Date(currentDate.setDate(currentDate.getDate() + daysToAdd));
  return newDate
}